import { useHelper, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { easing } from 'maath';
import React, { useRef, useMemo, useEffect } from 'react';
import { MathUtils, SRGBColorSpace, SkeletonHelper, Float32BufferAttribute, MeshStandardMaterial, SkinnedMesh, Skeleton, Bone, Uint16BufferAttribute, Vector3, BoxGeometry } from 'three';
import { pageAtom, pages } from './UI';

const easingFactor = 0.5;
const insideCurveStrength = .18;
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);
const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndices = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));

  skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinIndex, skinIndex, 0, 0);
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndices, 4)
);

pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const pageMaterials = [
  new MeshStandardMaterial({ color: "white" }),
  new MeshStandardMaterial({ color: "#111" }),
  new MeshStandardMaterial({ color: "white" }),
  new MeshStandardMaterial({ color: "white" }),
];

const preloadTextures = () => {
  pages.forEach((page) => {
    useTexture.preload(`/textures/${page.front}.jpg`);
    useTexture.preload(`/textures/${page.back}.jpg`);
    useTexture.preload(`/textures/book-cover-roughness.jpg`);
  });
};

preloadTextures();

const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [picture, picture2, pictureRoughness] = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`,
    ...(number === 0 || number === pages.length - 1 ? [`/textures/book-cover-roughness.jpg`] : []),
  ]);

  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;

  const pageRef = useRef();
  const skinnedMeshRef = useRef();
  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);

      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    const skeleton = new Skeleton(bones);
    const material = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: "white",
        map: picture,
        ...(number === 0 ? { roughnessMap: pictureRoughness } : { roughness: 0.1 }),
      }),
      new MeshStandardMaterial({
        color: "white",
        map: picture2,
        ...(number === pages.length - 1 ? { roughnessMap: pictureRoughness } : { roughness: 0.1 }),
      }),
    ];
    const mesh = new SkinnedMesh(pageGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [picture, picture2, pictureRoughness]);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }
    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? pageRef.current : bones[i];
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      let rotationAngle = insideCurveStrength * insideCurveIntensity * targetRotation;

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);
    }
  });

  return (
    <group ref={pageRef} {...props}>
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {pages.map((pageData, index) => (
        <Page
          key={index}
          page={page}
          number={index}
          opened={page > index}
          bookClosed={page === 0 || page === pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};

export default Book;

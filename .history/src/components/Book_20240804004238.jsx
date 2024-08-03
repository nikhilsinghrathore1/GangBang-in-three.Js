import { useHelper, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { N } from 'ethers';
import { useAtom } from 'jotai';
import React, { useRef, useMemo } from 'react';
import { SRGBColorSpace } from 'three';
import { SkeletonHelper } from 'three';
import { Float32BufferAttribute } from 'three';
import { MeshStandardMaterial, SkinnedMesh, Skeleton, Bone, Uint16BufferAttribute, Vector3, BoxGeometry } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { pageAtom, pages } from './UI';

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

pages.forEach((page)=>{
  useTexture.preload(`/textures/${page.front}.jpg`);
  useTexture.preload(`/textures/${page.back}.jpg`);
  useTexture.preload(`/textures/book-cover-roughness.jpg`);
});

const Page = ({ number, front, back, ...props }) => {

  const [picture , picture2, pictureRoughness] = useTexture([
    `../public/textures/${front}.jpg`,
    `../public/textures/${back}.jpg`,
    ...(number === 0 || number === pages.length -1
          ?[`../public/textures/book-cover-roughness.jpg`] : []
    ),
  ]);

  picture.colorSpace = picture2.colorSpace = SRGBColorSpace


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
        ...(number === 0 
          ? { roughnessMap: pictureRoughness }
          : { roughness: 0.1 }
        ),
      }),
      new MeshStandardMaterial({
        color: "white",
        map: picture2,
        ...(number === pages.length - 1
          ? { roughnessMap: pictureRoughness }
          : { roughness: 0.1 }
        ),
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
  


//   useHelper((skinnedMeshRef , SkeletonHelper , "red"))

               useFrame(()=>{

                              if(!skinnedMeshRef.current){
                                             return ; 
                              }
               })




  return (
    <group ref={pageRef} {...props}>
      <primitive object={manualSkinnedMesh} ref={skinnedMeshRef} />
    </group>
  );
};

const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom)
  return (
    <group {...props}>
      {
        pages.map((pageData, index) => (
          
            <Page
              position={[index * 0.15, 0, 0]}
              key={index}
              page={page}
              number={index}
              {...pageData}
            />
        ))
      }
    </group>
  );
};

export default Book;

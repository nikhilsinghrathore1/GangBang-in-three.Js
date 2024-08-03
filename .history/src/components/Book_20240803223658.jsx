import React, { useRef } from 'react'
import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { SkinnedMesh } from 'three';
import { Skeleton } from 'three';
import { Bone } from 'three';
import { Uint16BufferAttribute } from 'three';
import { Vector3 } from 'three';
import { BoxGeometry } from 'three';
import { pages } from './UI'


const PAGE_WIDTH = 1.28 ; 
const PAGE_HEIGHT = 1.71 ;
const PAGE_DEPTH = 0.003 ;
const PAGE_SEGMENTS = 30 ;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS ;

const pageGeometry = new BoxGeometry(
               PAGE_WIDTH,
               PAGE_HEIGHT,
               PAGE_DEPTH,    
               PAGE_SEGMENTS,
               2
);

pageGeometry.translate(PAGE_WIDTH/2,0,0);
const position = pageGeometry.attributes.position;
const vertex = new Vector3()
const skinindex = []
const skinWeight = []

for (let i = 0; i < position.count; i++) {
               vertex.fromBufferAttribute(position, i);
               const x = vertex.x;
               const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
             
               skinindex.push(skinIndex, skinIndex + 1, 0, 0);
               skinWeight.push(1 - skinIndex, skinIndex, 0, 0);
             }

pageGeometry.setAttribute(
               "skinIndex",
               new Uint16BufferAttribute(skinindex,4)
)

pageGeometry.setAttribute(
               "skinWeight",
               new Uint16BufferAttribute(skinWeight ,4)
)

const pageMaterials=[
               new MeshStandardMaterial({
                              color:whiteColor
               }),
               new MeshStandardMaterial({
                              color:"#111"
               }),
               new MeshStandardMaterial({
                              color:whiteColor
               }),
               new MeshStandardMaterial({
                              color:whiteColor
               }),
               new MeshStandardMaterial({
                              color:"pink"
               }),
               new MeshStandardMaterial({
                              color:"blue"
               }),

]




const Page = ({ number, front, back, ...props }) => {
  const pageRef = useRef()
  const group = useRef()
  const skinnedmeshRef = useRef()

  const manualSkinnedMesh = useMemo(()=>{
               const bones = [];
               for(let i = 0 ; i<=PAGE_SEGMENTS;i++){
                              let bone = new Bone()
                              bones.push(bone)

                              if( i=== 0 ){
                                             bone.position.x = 0 ;
                              }else{
                                             bone.position.x = SEGMENT_WIDTH;
                              }
                              if(i>0){
                                             bones[i-1].add(bone);
                              }
               }
               const skeleton = new Skeleton(bones);
               
               const materials = pageMaterials;
               const mesh = new SkinnedMesh(pageGeometry,materials)
               mesh.castShadow = true;
               mesh.receiveShadow = true;
               mesh.frustumCulled = full ; 
               mesh.add(skeleton.bones[0]);
               mesh.bind(skeleton)
               return mesh
  },[])


  return (
    <group ref={pageRef} {...props}>
               <primitive object = {manualSkinnedMesh} ref={skinnedmeshRef} />
    </group>
  )
}

const Book = ({ ...props }) => {
  return (
    <group {...props}>
      {
        pages.map((pageData, index) => (
               index === 0 ?
          <Page
            position={[index * 0.15, 0, 0]} // Correctly applying the position prop
            key={index}
            number={index}
            {...pageData}
          />:null
        ))
      }
    </group>
  )
}

export default Book

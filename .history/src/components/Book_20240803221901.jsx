import { vector3 } from 'maath';
import React, { useRef } from 'react'
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

for(let i = 0 ; i<position.count; i++){

               vertex.fromBufferAttribute(position,i);
               const x = vertex.x;
               const skinindex = Math.max(0,Math.floor(x/SEGMENT_WIDTH));

               skinindex.push(skinindex,skinindex+1,0,0);
               skinWeight.push(1-skinWeight,skinWeight,0,0)
}

pageGeometry.setAttribute(
               "skinIndex",
               
)


const Page = ({ number, front, back, ...props }) => {
  const pageRef = useRef()
  return (
    <group ref={pageRef} {...props}>
      <mesh scale={0.1}>
        <primitive object={pageGeometry} attach={'geometry'} />
        <meshBasicMaterial color="red" />
      </mesh>
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

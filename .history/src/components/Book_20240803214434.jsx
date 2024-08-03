import React, { useRef } from 'react'
import { pages } from './UI'


const PAGE_WIDTH = 1.28 ; 
const PAGE_HEIGHT = 1.71 ;
const PAGE_DEPTH = 0.003 ;
const PAGE_SEGMENTS = 30 ;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS ;

const pageGeometry = new boxGeometry(
               PAGE_WIDTH,
               PAGE_HEIGHT,
               PAGE_DEPTH,    
               PAGE_SEGMENTS,
               2
);


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

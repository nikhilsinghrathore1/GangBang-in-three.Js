import React, { useRef } from 'react'
import { pages } from './UI'

const Page = ({ number, front, back, ...props }) => {
  const pageRef = useRef()
  return (
    <group ref={pageRef} {...props}>
      <mesh scale={0.1}>
        <boxGeometry />
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

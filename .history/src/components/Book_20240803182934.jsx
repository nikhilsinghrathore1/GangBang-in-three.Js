import React, { useRef } from 'react'
import { pages } from './UI'

const Page = ({ number, front, back, ...props }) => {
               const pageRef = useRef()
  return (
    <group ref={pageRef}>
      <mesh scale={0.1}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  )
}
// console.log(pages)
{console.log([pages])}
const Book = ({ ...props }) => {
  return (
    <group {...props}>
      {
        [...pages].map((pageData, index) => (
          <Page 
               position={index * 2.15}
               key={index}
               number={index}
               {...pageData}
         />
        ))
      }
    </group>
  )
}

export default Book

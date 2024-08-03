import React from 'react'
import { pages } from './UI'

const Page = ({ number, front, back, ...props }) => {
  return (
    <group>
      <mesh scale={0.1}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  )
}
console.log(pages)
const Book = ({ ...props }) => {
  return (
    <group {...props}>
      {
        [...pages].map((pageData, index) => (
          <Page 
               position={index * 0.15}
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

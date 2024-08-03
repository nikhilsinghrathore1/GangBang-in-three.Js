import React from 'react'
import { Group } from '@react-three/fiber'
import { pages } from './UI'

const Page = ({ number, front, back, ...props }) => {
  return (
    <Group>
      <mesh scale={0.1}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </Group>
  )
}

const Book = ({ ...props }) => {
  return (
    <Group {...props}>
      {
        pages.map((pageData, index) => (
          <Page key={index} number={index} {...pageData} />
        ))
      }
    </Group>
  )
}

export default Book

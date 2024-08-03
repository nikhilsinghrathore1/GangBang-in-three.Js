import React from 'react'
import { Group } from 'three'
import { pages } from './UI'


const Page =({number , front , back , ...props})=>{
               return (
                              <group>
                                             <mesh scale={0.1}>
                                                            <boxGeometry/>
                                                            <meshBasicMaterial />
                                             </mesh>
                              </group>
               )
}

const Book = ({...props}) => {
  return (
               <group props={...props}>
                              {
                                             [...pages].map((pageData , index)=>(
                                                            <Page key={index} number={index} {...pageData} />
                                             ))
                              }
               </group>
  )
}

export default Book
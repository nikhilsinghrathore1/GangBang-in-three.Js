import React from 'react'
import { Group } from 'three'
import { pages } from './UI'

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
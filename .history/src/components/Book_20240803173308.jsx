import React from 'react'
import { Group } from 'three'
import { pages } from './UI'

const Book = ({...props}) => {
  return (
               <group props={...props}>
                              {
                                             [pages]
                              }
               </group>
  )
}

export default Book
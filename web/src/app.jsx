import React from 'react'

import { gql, useQuery } from '@apollo/client'

const QUERY_DREAM = gql`{
  dream
}`

const App = ()=>{
  const data = useQuery(QUERY_DREAM);
    console.log(data)
  return (
    <div>
      The appcliation coponentn
    </div>
  )
}

export default App
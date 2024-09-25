import React from 'react'
import { Login ,Main} from '../src/components/'

const App = () => {
  const token = localStorage.getItem("token") || null
   return (
    <div>
       {
         token ? <Main/> : <Login/>
    }
    </div>
  )
}

export default App

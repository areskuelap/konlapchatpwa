import React, { useState, useEffect } from 'react';
import Home from "./components/home"

function App() {

  useEffect(() => {
    document.title = "Konlap chat"
  })

  return(
    <div className="bg-white">
      <Home/>
    </div>
  )

}

export default App;
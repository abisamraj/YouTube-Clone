import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Video from './pages/Video/Video'
import SearchResults from './pages/SearchResults/SearchResults'
import './App.css'

const App = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div className="app">
      <Navbar setSidebar={setSidebar} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home sidebar={sidebar} />} />
          <Route path="/video/:categoryId/:videoId" element={<Video />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

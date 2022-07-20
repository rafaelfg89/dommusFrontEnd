import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Edit from './pages/edit';
import Home from './pages/home';

function App() {


  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/edit/:id' element={<Edit/>}/>
    </Routes>
  )
}

export default App

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Register from "../components/register";
import Home from "../pages/home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}
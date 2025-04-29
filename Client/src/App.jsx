import React from 'react';
import Signup from './Component/Signup';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import Home from './Component/Home';
import Navbar from './Component/Navbar'; // Import Navbar
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashpage from './Pages/Dashpage';
import Homepage from './Pages/Homepage';
import UpdateUser from './Component/UpdateUser';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar shown on all pages */}
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="/update/:id" element={<UpdateUser />} />
        <Route path='/dashboard' element={<Dashpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { useAuthStore } from './store/useAuthStore';
import {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';


const App = () => {
    const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
    const {theme} = useThemeStore();
    
    useEffect(()=>{
       checkAuth();
    }, 
    [checkAuth]);

    if (isCheckingAuth && !authUser) {
      return(
        <div className='h-screen flex items-center justify-center'>
          <Loader className='size-10 animate-spin' />
        </div>
      )
    }
    
  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage />: <Navigate to='/login' />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App


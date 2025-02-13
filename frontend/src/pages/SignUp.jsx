import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import {MessageSquare, User, MailIcon, Key, EyeOff, Eye, Loader2} from 'lucide-react';
import {Link} from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {signUp, isSigningUp} = useAuthStore();

    const [formData, setFormData] = useState({
      fullName:'',
      email: '',
      password: ''
    });

    const handleChange = (e)=>{
      const {name, value} = e.target;
      setFormData((prevValues)=>(
        {...prevValues,
          [name]:value
        }
      ))
    }

    const validateForm = ()=>{
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
        return toast.error('All fields are required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return toast.error('Please enter a valid email address');
      }

      if (formData.password.length < 6) {
        return toast.error('Password must be at least 6 characters long');
      }

      return true;

    }

    const handleSubmit = (e)=>{
      e.preventDefault();
        const success = validateForm();
        if (success===true) signUp(formData);
    }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>

      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
          <div className='w-full max-w-md space-y-8'>
              <div className='text-center mb-8'>
                <div className='flex flex-col items-center gap-2 group'>
                    <div 
                    className='size-12 rounded-xl bg-primary/10 flex items-center
                    justify-center group-hover:bg-primary/20 transition-colors'>
                        <MessageSquare className='size-6 text-primary' />
                    </div>
                    <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
                    <p className='text-base-content/60'>Get Started with your free account</p>
                </div>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='form-control'>
                          <label className='label'>
                            <span className='label-text font-medium'>Full Name</span>
                          </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex
                            items-center pointer-events-none'>
                                  <User className='size-5 text-base-content/40'/>
                            </div>
                            <input 
                            type="text"
                            className={'input input-bordered w-full pl-10'}
                            placeholder='Joe Doe'
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange} />
                        </div>
                    </div>

                    <div className='form-control'>
                          <label className='label'>
                            <span className='label-text font-medium'>Email</span>
                          </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex
                            items-center pointer-events-none'>
                                  <MailIcon className='size-5 text-base-content/40'/>
                            </div>
                            <input 
                            type="text"
                            className={'input input-bordered w-full pl-10'}
                            placeholder='Joe@gmail.com'
                            name='email'
                            value={formData.email}
                            onChange={handleChange} />
                        </div>
                    </div>

                    <div className='form-control'>
                          <label className='label'>
                            <span className='label-text font-medium'>Password</span>
                          </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex
                            items-center pointer-events-none'>
                                  <Key className='size-5 text-base-content/40'/>
                            </div>
                            <input 
                            type={showPassword?'text':'password'}
                            className={'input input-bordered w-full pl-10'}
                            placeholder='*********'
                            name='password'
                            value={formData.password}
                            onChange={handleChange} />
                            <button
                            type='button'
                            className='absolute inset-y-0 right-0 pr-3 flex items-center'
                            onClick={()=>setShowPassword(!showPassword)}>
                                  {showPassword ? 
                                  (<EyeOff className='size-5 text-base-content/40'/>)
                                  : (<Eye className='size-5 text-base-content/40' />)}
                            </button>
                        </div>
                    </div>
                    <button className='btn btn-primary w-full' disabled={isSigningUp}>
                        {
                          isSigningUp ? 
                          (<><Loader2 className='size-5 animate-spin'/>Loading.....</>) :
                          ('Create Account')
                        }
                    </button>
                </form>
                <div className='text-center'>
                    <p className='text-base-content/60'>
                      Already have an account?
                      <Link  to='/login' className='link link-primary'>
                        Sign in
                      </Link>
                    </p>
                </div>
              </div>
          </div>
      </div>
      
      <AuthImagePattern 
      title='Join Our Community'
      subtitle='Connect with friends, share, and stay in touch with your customers'
      />

    </div>
  )
}

export default SignUp

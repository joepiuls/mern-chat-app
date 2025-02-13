import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/'

export const useAuthStore = create((set, get)=>({
    authUser: null,
    isLoggingIn: false,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    onlineUsers:[],
    socket: null,

    
    checkAuth: async () => { 
        try {
          const res = await axiosInstance.get('/auth/check');
          set({isCheckingAuth:true});
          set({authUser:res.data});

          get().connectSocket();
        } catch (error) {
            console.log('Error in Checking Auth', error);
            set({isCheckingAuth:false});
            set({authUser:null});
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signUp: async (data)=>{
        set({isSigningUp:true});
        try {
         
       const res = await axiosInstance.post('/auth/signup', data);
       set({authUser:res.data});
       toast.success('User created sucessfully');

       get().connectSocket();
        } catch (error) {
            console.log('Error in signing up', error);
            toast.error(error.response.data.message);
            set({authUser:null});
        } finally{
            set({isSigningUp:false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            get().disconnectSocket();
            toast.success('Logged out sucessfully');
        } catch (error) {
            console.log('Error in Logging out', error);
            toast.error(error.response.data.message);
        }
    },

    login: async (data) => {
        try {
        const res = await axiosInstance.post('/auth/login/', data);
        set({authUser:res.data});
        toast.success('User is signed in sucessfully');

        
        get().connectSocket();
        } catch (error) {
            console.log('Login Error', error);
            toast.error(error.response.data.message);
            set({authUser:null})
        } finally{
            set({isLoggingIn:false});
            
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({authUser:res.data});
            toast.success('Profile updated sucessfully');
        } catch (error) {
            console.log('Error in updating profile', error);
            toast.error(error.response.data.message);
        } finally{
            set({isUpdatingProfile:false});
        }
    },

    connectSocket: () => {
        const authUser = get().authUser;
        
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();

        set({socket: socket});
        socket.on('getOnlineUsers', (userIds)=>{
            set({onlineUsers:userIds});
        })
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();  
            set({ socket: null }); 
        }
    }
    
}))
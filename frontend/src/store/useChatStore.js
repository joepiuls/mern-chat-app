import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";



export const useChatStore = create((set, get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    selectedUser: null,


    getUsers: async () => {
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get('/messages/users');
            set({users:res.data});
        } catch (error) {
            console.log('Error fetching users', error);
            toast.error(error.response.data.message);
        } finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
            
        } catch (error) {
            console.log('Error fetching Messages', error);
            toast.error(error.response.data.message);
        } finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages:[...messages, res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedUser: (user) => {
        set({selectedUser:user});
    },

    subscribeToMessages: () => {
        const { selectedUser } = get(); 
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState()?.socket;
    
        if (!socket) return;
    
        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set((state) => ({
                messages: [...(state.messages || []), newMessage] 
            }));
        });
    },
    

    unsubscribeForMessages: () => {
        const socket = useAuthStore.getState()?.socket; 
        console.log(socket);
        
        if (!socket) return;
        
        socket.off('newMessages');
    }
    
}))
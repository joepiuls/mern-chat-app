import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore"
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";


const Sidebar = () => {
    const {users, getUsers, selectedUser, isUsersLoading, setSelectedUser} = useChatStore();
    const {onlineUsers} = useAuthStore();

    const [showOnlineUsers, setShowOnlineUsers] = useState(false);

    useEffect(()=>{
        getUsers();
    }, [getUsers]);

    if(isUsersLoading) return <SidebarSkeleton />

    const filteredUsers = showOnlineUsers ? users.filter(user=>onlineUsers.includes(user._id)) : users;

 return (
    <div className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col overflow-auto transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
            <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span className="font-medium hidden lg:block">Contacts</span>
            </div>
        </div>

        <div className="mt-2 lg:flex items-center gap-2">
            <label className="flex items-center px-4 py-2 gap-2">
                <input type="checkbox"
                    checked = {showOnlineUsers}
                    onChange={(e)=>{setShowOnlineUsers(e.target.checked)}}
                    className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length-1}) online</span>
        </div>
        {/* User Contacts */}

        {filteredUsers.map((user, key)=>(
            <button 
                key={key}
                onClick={()=>setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 
                    ${selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}`}
            >
                <div className="relative mx-auto lg:mx-0">
                    <img 
                    src={user.profilePic || '/avatar.jpg'} 
                    alt={user.username} 
                    className="w-12 h-12 rounded-full" />
                    {onlineUsers.includes(user._id) && (
                        <span 
                            className="absolute bottom-0 right-0 size-3 
                            bg-green-500 rounded-full ring-2 ring-zinc-900"
                        />
                    )}
                </div>

                <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                        {onlineUsers.includes(user._id) ? 'online' : 'offline'}
                    </div>
                </div>
            </button>
        ))}

       {filteredUsers.length === 0 && (
        <div className="text-center text-zinc-500 py-2">No online users</div>
       )}
    </div>
  )
}

export default Sidebar


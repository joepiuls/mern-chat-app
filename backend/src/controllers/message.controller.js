import User from "../models/user.model.js";
import Message from "../models/messages.model.js";
import cloudinary from "../libs/cloudinary.js";
import { getRecieverSocketId, io } from "../libs/socket.js";


export const getUsersForSidebar = async (req, res) => {

    try {
        const loggedInUser = req.user;
        const fetchedUsers = await User.find({ _id: { $ne: loggedInUser._id } });
        return res.status(200).json(fetchedUsers);
        
    } catch (error) {
        console.log('Error in getUsersForSidebar', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export const getMessages = async (req, res)=>{
    try {
        const {id: recieverId} = req.params;
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: loggedInUserId, receiverId: recieverId},
                {senderId: recieverId, receiverId: loggedInUserId}
            ]
        });
        return res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessages', error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
}

export const sendMessage = async (req, res)=>{
    try {
        const {id: recieverId} = req.params;
        const loggedInUserId = req.user._id;
        const {text, image} = req.body;
        let imageUrl = null;

        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }
        const newMessage =  new Message({
            senderId:loggedInUserId,
            receiverId: recieverId,
            text: text,
            image: imageUrl
        });

        await newMessage.save();

        //realtime function
        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage', newMessage);
        }

        return res.status(200).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
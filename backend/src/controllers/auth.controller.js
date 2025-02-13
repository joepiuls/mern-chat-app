import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import cloudinary from '../libs/cloudinary.js'
import { seedUsers } from "../seed/seed.user.js";

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
    
        // Validation checks with returns
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        // Save user and send response
        await newUser.save();
        
        // Generate token AFTER saving (if token generation requires DB ID)
        generateToken(newUser._id, res);

        // Correct response syntax
        return res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName
        });

    } catch (error) {
        console.log('Error in signup controller:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Validation checks with returns
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).json({message:'User is not registered'})
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({message:'Invalid password'})
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email: user.email,
            profilPic: user.profilPic
        })
    } catch (error) {
        
    }
};

export const logout = async(req, res) => {
    try {
        res.cookie('jwt', {maxAge:0});
        res.status(200).json({message: 'Loggedout Sucessfully'})
    } catch (error) {
        console.log('Login Error', error.message);
        return res.status(500).json({ErrorMessage:'Internal Server Error'})
        
    }
};

export const updateProfile = async(req, res)=>{
    try {
        const { profilPic } = req.body;
        const userId = req.user._id;

        if (!profilPic) {
            return res.status(400).json({message:'Profile Picture required'});
        }

       const updateProfilePic = await cloudinary.uploader.upload(profilPic);
       const updatedProfile = await User.findByIdAndUpdate(
        userId, 
        {profilPic: updateProfilePic.secure_url}, 
        {new:true});

        return res.status(200).json(updatedProfile);
    } catch (error) {
        console.log('updateProfilePic error', error.message);
        return res.status(5000).json({message:'Internal server error'});
    }
}

export const checkAuth = (req, res)=>{
    try {                
        return res.status(200).json(req.user);
    } catch (error) {
        console.log('Error in checkAuth controller', error.message);
        return res.status(5000).json({message:'Internal server error'});
    }
}

export const seedUser = async (req, res) => {
    try {
        await User.insertMany(seedUsers);
        return res.status(200).json({message:'Users seeded successfully'})
    } catch (error) {
        console.log('Error in seedUsers controller', error.message);
    }
}
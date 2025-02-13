import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {

        //request token
        const token = req.cookies?.jwt;
        
        //validate token
        if (!token) {
          return  res.status(401).json({message:'Unauthorised-No token provided'});
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return  res.status(404).json({message:'User not found'});
        }

        req.user = user;
        
        next();

    } catch (error) {
        console.log('Error in protection middleware', error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
}

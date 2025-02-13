import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import {protectRoute} from '../middlewares/auth.middleware.js'

const route = express.Router();

route.post('/login', login);

route.post('/signup', signup);

route.post('/logout', logout);

route.put('/update-profile', protectRoute, updateProfile);

route.get('/check', protectRoute, checkAuth);

export default route;
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import { connectDB } from './libs/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import {app, server} from './libs/socket.js';
import path from 'path';


dotenv.config();

app.use(express.json({ limit: "10mb" }));  // Adjust size as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const __dirname = path.resolve();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../../frontend')));

  app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '/frontend', 'build', 'index.html'));
  })
}



const port = process.env.PORT || 5000;



server.listen(5000, ()=>{
    connectDB();
    console.log('Server is running on port:'+port);
})
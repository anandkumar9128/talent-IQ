import express from 'express';
import { ENV } from './lib/env.js';
import path, { dirname } from 'path';
import { connect } from 'http2';
import { connectDb } from './lib/db.js';
import { log } from 'console';
import cors from 'cors';
import {serve} from 'inngest/express'
import { functions, inngest } from './lib/inngest.js';
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from './routes/chatRoute.js';
import sessionRoutes from './routes/sessionRoute.js';

const app=express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(clerkMiddleware()); //this adds req auth

app.use("/api/inngest",serve({client:inngest,functions}))
app.use('/api/chat',chatRoutes)
app.use('/api/sessions',sessionRoutes)

app.get('/status',(req,res)=>{
    res.send("Hello World");
});
if(ENV.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.get('/{*any}',(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend','dist','index.html'));
    });
}

const startServer=async()=>{
    try {
        await connectDb();
        app.listen(ENV.PORT,()=>{
            console.log("Server is running on port: ",ENV.PORT);
        })
    } catch (error) {
        console.log("Error starting the server",error);
    }
}
startServer();
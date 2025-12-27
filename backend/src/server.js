import express from 'express';
import { ENV } from './lib/env.js';
import path, { dirname } from 'path';
import { connect } from 'http2';
import { connectDb } from './lib/db.js';
import { log } from 'console';
const app=express();
const __dirname = path.resolve();

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
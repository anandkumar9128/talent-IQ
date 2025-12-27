import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb=async()=>{
    try {
        if(!ENV.DB_URL){
            throw new Error("MONGODB_URL is not defined in env variables")
        }
        const conn =await mongoose.connect(ENV.DB_URL)
        console.log("Connected to MongoDb",conn.connection.host)
    } catch (error) {
        console.log("error in connecting mongodb",error)
        process.exit(1);
    }
}
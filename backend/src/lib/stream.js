import {StreamChat} from 'stream-chat';
import {StreamClient} from '@stream-io/node-sdk';
import { ENV } from './env.js';

const apikey=ENV.STREAM_API_KEY;
const apiSecret=ENV.STREAM_API_SECRET

if(!apikey || !apiSecret){
    console.log("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const streamClient=new StreamClient(apikey,apiSecret)
export const chatClient=StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser=async(userData)=>{
    try {
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully",userData);
    } catch (error) {
        console.error("Error upserting stream user:",error);
    }
}
export const deleteStreamUser=async(userId)=>{
    try {
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted",userId);
    } catch (error) {
        console.error("Error deleting stream user:",error);
    }
}
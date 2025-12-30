import { chatClient, streamClient } from "../lib/stream.js";
import Session  from "../models/Session.js";

export async function createSession(req,res){
    try {
        const {problem,difficulty}=req.body;
        const userId=req.user._id;

        if(!problem || !difficulty){
            return res.status(400).json({message:"Problem and difficulty are required"})
        }
        //generate a unique call id for stream video
        const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        //create session in db 
        const session=await Session({problem,difficulty,host:userId,callId});

        //create stream video call
        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkMiddleware,
                custom:{problem,difficulty,sessionId:session._id.toString()}
            }
        })
        
        //chat messaging
        const channel=chatClient.channel("messaging",callId,{
            name:`${problem} Session`,
            created_by_id:clerkMiddleware,
            members:[clerkId]
        })
        await  channel.create()
        res.status(201).json({session})
    } catch (error) {
        console.log("Error in createSession controller:",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getActiveSessions(_,res){
    try {
        const sessions= await Session.find({status:"active"})
        .populate("host","name profileImage email clerkId")
        .sort({createdAt:-1})
        .limit(20);

        res.status(200).json({sessions})
        
    } catch (error) {
        console.log("Error in getActiveSessions controller:",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getMyRecentSessions(req,res){
    try {
        const userId=req.user._id;
        //get sessions where user is host or paricipant
        const sessions=await Session.find({status:"completed", $or:[{host:userId},{participant:userId}]})
        .sort({createdAt:-1})
        .limit(20);

        res.status(200).json({sessions})
    } catch (error) {
        console.log("Error in getMyRecentSessions controller:",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getSessionById(req,res){
    try {
        const {id}=req.params
        const session=await Session.findById(id)
        .populate("host","name email profileImage clerkId")
        .populate("participant","name email profileImage clerkId")

        if(!session) return res.status(404).json({message:"Session not found"});
        res.status(200).json({session});        
    } catch (error) {
        console.log("Error in getSessionById conroller:", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function joinSession(req,res){
    try {
        const {id}=req.params
        const userId=req.user._id
        const clerkId=req.user.clerkId

        const session=await Session.findById(id);

        if(!session) return res.status(404).json({message:"Session not found"})
        
        //check if session is already full
        if(session.participant) return res.status(404).json({message:"Session is full"})  

        session.participant=userId
        await Session.save()
        const channel=chatClient.channel("messaging",session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session});
    } catch (error) {
        console.log("Error in joinSession conroller:", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export async function endSession(req,res){
    try {
        const {id}=req.params
        const userId=req.user._id
        const session=await Session.findById(id);
        
        if(!session) return res.status(404).json({message:"Session not found"});

        //check is user is the host
        if(session.host.toString()!==userId.toString()){
            return res.status(403).json({message:"Only the session can end the session"})
        }

        //check if session is already complated
        if(session.status==="completed"){
            return res.status(400).json({message:"Session is already completed"})
        }

        session.status="completed"
        await Session.save()

        //delete stream video call
        const call=streamClient.video.call("default",session.callId);
        await call.delete({hard:true})

        //delete stream chat channel
        const channel=chatClient.channel("messaging",session.callId)
        await channel.delete();

        res.status(200).json({session,message:"Session ended successfully"});
    } catch (error) {
        console.log("Error in endSession conroller:", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

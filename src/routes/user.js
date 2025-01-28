const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAVE_DATA = "firstName lastName age about gender skills"

userRouter.get("/user/requests/received",userAuth, async (req,res) =>{

    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName lastName photoUrl about gender age skills");

    // }).populate("fromUserId",["firstName","lastName","photoUrl","age","skills"]);

        res.json({
            message:"Data Fetched Successfully!!",
            data:connectionRequest
        })

    }catch(err){
        return res.status(400).send("ERROR "+ err.message);
    }
    
} );

userRouter.get("/user/connections", userAuth, async (req,res)=>{

    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"},
            ]
        }).populate("fromUserId","firstName lastName age about gender skills")
        .populate("toUserId","firstName lastName age about gender skills");

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data:data})
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

userRouter.get("/feed", userAuth, async(req,res)=>{
    try{
        // /feed?page=1&limit=10
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ?50 : limit;
        const skip = (page -1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach(request =>{
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
          $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id } },
          ],
        }).select(USER_SAVE_DATA).skip(skip).limit(limit);

        res.send(users);
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})

module.exports = userRouter;
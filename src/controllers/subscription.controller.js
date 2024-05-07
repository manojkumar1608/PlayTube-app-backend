import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // toggle subscription
    if(!channelId){
        throw new ApiError(400,"channelId is Requitred!!")
    }
    const userId = req.user?._id;
    const credential = {subscriber:userId,channel:channelId};
   try {
     const subscribed = await Subscription.findOne(credential);
     if(!subscribed){//not subscribed :- delete the existing one
         const newSubscription = await Subscription.create(credential);
         if(!newSubscription){
             throw new ApiError(500,"Unable to Subscribe channel")
         }
         return res
         .status(200)
         .json(new ApiResponse(200,newSubscription,"Channel Subscribed Successfully!!"))
     }
     else{
         //subscribed :-delete the subscription
         const deletedSubscription = await Subscription.deleteOne(credential);
         if(!deletedSubscription){
             throw new ApiError(500,"Unable to Unsubscribe channel")
         }
         return res
         .status(200)
         .json(new ApiResponse(200,{deletedSubscription},"Channel Unsubscribed Successfully!!"))
     }
   } catch (e) {
     throw new ApiError(500,e?.message || "Unable to toggle subscription")
   }

})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.body
    if (!channelId?.trim() || !isValidObjectId(channelId)) {
      throw new ApiError(400, "channelid is requierd or invalid");
    }
  
    const channel = await User.findById(channelId);
  
    if (!channel) {
      throw new ApiError(400, "channel not found!");
    }
  
    const subscriber = await Subscription.aggregate([
      {
        $match: { channel: new mongoose.Types.ObjectId(channelId) },
      },
  
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribers",
          pipeline: [
            {
              $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          subscriber: {
            $first: "$subscribers",
          },
        },
      },
      {
        $project:{
          subscribers:1,
        
        }
      },
     
    ]);
  
    if (subscriber.length == 0) {
      throw new ApiError(404, "No subscriber found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, subscriber, "fetched subscirber successfully!"));
  

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.body;
  if (!channelId.trim() || !isValidObjectId(channelId)) {
    throw new ApiError(400, "channle id is required or invalid!");
  }

  const channel = await User.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "user not found!");
  }

  const subscribedToChannel = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedTo",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscribedTo: {
          $first: "$subscribedTo",
        },
      },
    },
    {
      $project: {
        subscribedTo: 1,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$subscribedTo",
      },
    },
  ]);

 
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedToChannel,
        "fetched subscirber successfully!"
      )
    );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
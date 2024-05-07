import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
const getAllTweets= asyncHandler(async (req, res) => {
    //getting all videos based on query, sort, pagination
    const { page = 1, limit = 10, query =`/^tweet/` , sortBy= "createddAt", sortType= 1} = req.query
    
  

    const getAllTweets = await Tweet.aggregate([
        {
            $match: { 
                $or: [
                    { content: { $regex: query, $options: 'i' } },
                ]
            }
        },
        {
            $sort:{
                [sortBy]: sortType
            }
        },
        {
            $skip: (page -1) * limit
        },
        {
            $limit: parseInt(limit)
        }

    ])

    Tweet.aggregatePaginate(getAllTweets, {page, limit})
    .then((result)=>{
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "fetched all Tweets successfully !!"
            )
        )
    })
    .catch((error)=>{
        console.log("getting error while fetching all videos:",error)
        throw error
    })
})
const createTweet = asyncHandler(async (req, res) => {
    // creating tweet
    const { content } = req.body
    const userID = req.user._id

    if (!content || content.trim() == "") {
        throw new ApiError(400, "content must be rquired")
    }
    const tweet = await Tweet.create({
        owner: userID,
        content
    })
    if (!tweet) {
        return new ApiError(500, "Something went wrong while Creating Tweet")
    }
    return res.status(200)
        .json(new ApiResponse(
            200,
            { tweet },
            "Tweet created Successfully"
        ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "This user id is not valid")
    }

   // find user in database 
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // match and find all tweets
    const tweets = await Tweet.aggregate([
        {
            $match:{
                owner: user._id,
            }

        }
    ]);

    if(!tweets){
        throw new ApiError(500, "something went wrong while fetching tweets")

    }
    // return response
     return res.status(201).json(
        new ApiResponse(200, tweets, "tweets fetched  successfully!!"))
})

const updateTweet = asyncHandler(async (req, res) => {
    
    const { newContent } = req.body
    const { tweetId } = req.params


    if(!newContent || newContent?.trim()===""){
        throw new ApiError(400, "content is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "This tweet id is not valid")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found!");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this tweet!");
    }


    const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content:newContent 
            }  
        },
        {
            new:true
        }
    )

   if(!updateTweet){
    throw new ApiError(500, "something went wrong while updating tweet")
   }

   // return responce
   return res.status(201).json(
    new ApiResponse(200, updateTweet, "tweet updated successfully!!"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    // delete tweet
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "This tweet id is not valid")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "no tweet found!");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this tweet!");
    }

    const deleteTweet = await Tweet.deleteOne(tweet._Id)

    // console.log("delete successfully", deleteTweet)

    if(!deleteTweet){
        throw new ApiError(500, "something went wrong while deleting tweet")
       }

       // return response
       return res.status(201).json(
        new ApiResponse(200, deleteTweet, "tweet deleted successfully!!"))
})

export {
    getAllTweets,
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

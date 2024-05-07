import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    // toggle like on video
    const {videoId} = req.params
    const userId = req.user._id    
    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"video not found")
    }
    // find in db
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found in db")
    }
    const credentials = { video:videoId, likedBy:userId }
    try {
        const Liked = await Like.findOne(credentials)
        if(!Liked){
            const newLike = await Like.create(credentials)
            if(!newLike){
                throw new ApiError(500, "Unable to Like the Video")
            }
            return res.status(200)
            .json(new ApiResponse(200,{newLike}, "Video Liked Successfulley"))
        }
        else{
            const deleteLike = await Like.deleteOne(credentials)
            if(!deleteLike){
                throw new ApiError(500,"unable to remove the Like")
            }
            return res.status(200)
            .json(new ApiResponse(200, {deleteLike} , "Like removed Successfully"))
        }

    } catch (error) {
        throw new ApiError(500,error.message,"Something went Wrong !! unabe to toggle Like ")
        
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // toggle like on comment
    const userId = req.user._id    
    if(!isValidObjectId(commentId)){
        throw new ApiError(404,"video not found")
    }
    // find in db
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"Video not found in db")
    }
    const credentials = { comment:commentId, likedBy:userId }
    try {
        const Liked = await Like.findOne(credentials)
        if(!Liked){
            const newLike = await Like.create(credentials)
            if(!newLike){
                throw new ApiError(500, "Unable to Like the comment")
            }
            return res.status(200)
            .json(new ApiResponse(200,{newLike}, "comment Liked Successfulley"))
        }
        else{
            const deleteLike = await Like.deleteOne(credentials)
            if(!deleteLike){
                throw new ApiError(500,"unable to remove the Like")
            }
            return res.status(200)
            .json(new ApiResponse(200, {deleteLike} , "Like removed Successfully"))
        }

    } catch (error) {
        throw new ApiError(500,error.message,"Something went Wrong !! unabe to toggle comment Like ")
        
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    // toggle like on tweet
    const {tweetId} = req.params
    const userId = req.user._id    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(404,"video not found")
    }
    // find in db
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"Video not found in db")
    }
    const credentials = { tweet:tweetId, likedBy:userId }
    try {
        const Liked = await Like.findOne(credentials)
        if(!Liked){
            const newLike = await Like.create(credentials)
            if(!newLike){
                throw new ApiError(500, "Unable to Like the Tweet")
            }
            return res.status(200)
            .json(new ApiResponse(200,{newLike}, "Tweet Liked Successfulley"))
        }
        else{
            const deleteLike = await Like.deleteOne(credentials)
            if(!deleteLike){
                throw new ApiError(500,"unable to remove the Like")
            }
            return res.status(200)
            .json(new ApiResponse(200, {deleteLike} , "Like removed Successfully"))
        }

    } catch (error) {
        throw new ApiError(500,error.message,"Something went Wrong !! unabe to toggle Tweet Like ")
        
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    // getting all liked videos
    const videos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: {
                    $exists: true
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            videoFile: 1,
                            thumbnail: 1,
                            owner:1,
                            duration:1,
                            views: 1,
                            createdAt:1,
                            updatedAt: 1
                            
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                videos: {
                    $first: "$videos"
                }
            }
        }, 
        {
            $project: {
                videos: 1,
                _id: 0
            }
        },
        // {
        //     $replaceRoot:{
        //      newRoot: "$videos" 
        //     }
        // }
    ]);

    res.status(200).json(new ApiResponse(
        200,
        {videos, videosCount: videos.length},
        "Get liked videos success"
    ));


    
});


const getLikes = asyncHandler(async (req, res) => {
    // getting all Likes for a video
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "This video id is not valid")
    }

    // find video in database 
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found");
    }

    // match and finds all the Likes
    const aggregateLikes = await Like.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        }
    ]);
    if(!aggregateLikes){
        throw new ApiError(500, "something went wrong while fetching likes")

    }
    // Like.aggregatePaginate(aggregateLikes)
            return res.status(200).json(
                new ApiResponse(200, {aggregateLikes , Likeslength : aggregateLikes.length}, "VideoLikes fetched  successfully!!"))

           
})
const getCommentLikes = asyncHandler(async (req, res) => {
    // getting all commentLikes for a video
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "This video id is not valid")
    }

    // find video in database 
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    // match and finds all the Likes
    const aggregateLikes = await Like.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(commentId)
            }
        }
    ]);
    if(!aggregateLikes){
        throw new ApiError(500, "something went wrong while fetching likes")

    }
    // Like.aggregatePaginate(aggregateLikes)
            return res.status(200).json(
                new ApiResponse(200, {aggregateLikes , Likeslength : aggregateLikes.length}, "VideoLikes fetched  successfully!!"))

           
})
const getTweetLikes = asyncHandler(async (req, res) => {
    // getting all tweetLikes for a tweet
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "This video id is not valid")
    }

    // find video in database 
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    // match and finds all the Likes
    const aggregateLikes = await Like.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        }
    ]);
    if(!aggregateLikes){
        throw new ApiError(500, "something went wrong while fetching likes")

    }
            return res.status(200).json(
                new ApiResponse(200, {aggregateLikes , Likeslength : aggregateLikes.length}, "VideoLikes fetched  successfully!!"))

           
})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikes,
    getCommentLikes,
    getTweetLikes
}
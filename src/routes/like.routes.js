import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikes,
    getCommentLikes,
    getTweetLikes
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/likes/:videoId").get(getLikes);
router.route("/commentlikes/:commentId").get(getCommentLikes);
router.route("/tweetlikes/:tweetId").get(getTweetLikes);
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(verifyJWT ,toggleVideoLike);
router.route("/toggle/c/:commentId").post(verifyJWT ,toggleCommentLike);
router.route("/toggle/t/:tweetId").post(verifyJWT ,toggleTweetLike);
router.route("/L/videos").get(verifyJWT ,getLikedVideos);

export default router
import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get( getAllTweets);
router.route("/").post(verifyJWT , createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(verifyJWT , updateTweet).delete(verifyJWT ,deleteTweet);

export default router
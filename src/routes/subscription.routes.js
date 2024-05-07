import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/c/:channelId").post(verifyJWT,toggleSubscription); 
    router.route("/s/:channelId").post(getSubscribedChannels)
    

router.route("/u/:subscriberId").post( getUserChannelSubscribers);

export default router
import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments);
router.route("/:videoId").post(verifyJWT , addComment);
router.route("/c/:commentId").delete(verifyJWT ,deleteComment);
router.route("/c/:commentId").patch(verifyJWT ,updateComment);

export default router
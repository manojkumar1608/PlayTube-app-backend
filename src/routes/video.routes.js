import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    toggleVideoViews,
    getUserVideos,
    getSearchresults,
    getSearchSuggestions
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/").get(getAllVideos)
router.route("/user").post(getUserVideos)
router.route("/search").get(getSearchresults)
router.route("/suggestions").get(getSearchSuggestions)


router
    .route("/")
    
    .post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT ,deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"),updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT ,togglePublishStatus);
router.route("/toggle/views/:videoId").post(verifyJWT ,toggleVideoViews);

export default router
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    // build a healthcheck response that simply returns the OK status as json with a message
    const user = req.user.username
    if(!user){
        throw new ApiError(404, "user not found")
    }
    return res.status(200)
    .json(new ApiResponse(200 ,"Hey",{user}, "Everything Looks COOL"))
})

export {
    healthcheck
    }
    
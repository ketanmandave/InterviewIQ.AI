import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';


export const getUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(
        new ApiResponse(
            200, 
            "User fetched successfully",
            user
        )
    );
});

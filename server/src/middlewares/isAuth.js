import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import Jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];
        if(!token){
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const decodedToken = Jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.userId);

        if(!user){
            throw new ApiError(401, "Unauthorized: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }
});

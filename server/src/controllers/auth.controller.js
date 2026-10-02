import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import genToken from '../config/token.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { verifyFirebaseToken } from '../config/firebaseToken.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sendLoginResponse = (res, user, message, statusCode = 200) => {
    const accessToken = genToken(user._id);

    return res
        .status(statusCode)
        .cookie('accessToken', accessToken, cookieOptions)
        .json(
            new ApiResponse(
                statusCode,
                message,
                { user }
            )
        );
};

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate all manual-registration fields before accessing the database.
    if ([name, email, password].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, 'Name, email and password are required');
    }

    if (password.length < 8) {
        throw new ApiError(400, 'Password must be at least 8 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
    });

    const createdUser = await User.findById(user._id);
    return sendLoginResponse(res, createdUser, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    // Password is select:false in the model, so explicitly include it for comparison.
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const loggedInUser = await User.findById(user._id);
    return sendLoginResponse(res, loggedInUser, 'User logged in successfully');
});

export const googleAuth = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new ApiError(400, 'Google ID token is required');
    }

    // Never trust name/email from the browser; Firebase verifies the signed token.
    let decodedToken;

    try {
        decodedToken = await verifyFirebaseToken(idToken);
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, 'Invalid or expired Google token');
    }

    if (!decodedToken.email || !decodedToken.email_verified) {
        throw new ApiError(401, 'A verified Google email is required');
    }

    const email = decodedToken.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name: decodedToken.name || email.split('@')[0],
            email,
            googleUid: decodedToken.uid,
        });
    } else if (!user.googleUid) {
        user.googleUid = decodedToken.uid;
        await user.save();
    }

    return sendLoginResponse(res, user, 'User logged in successfully');
});

export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie('accessToken', {
            httpOnly: cookieOptions.httpOnly,
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
        })
        .json(
            new ApiResponse(
                200,
                'User logged out successfully',
                null
            )
        );
});

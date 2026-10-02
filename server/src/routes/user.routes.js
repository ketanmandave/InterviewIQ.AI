import express from 'express';
import {verifyJWT} from '../middlewares/isAuth.js';

import { getUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/currentUser', verifyJWT, getUser);

export default userRouter;
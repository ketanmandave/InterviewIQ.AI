import express from 'express';
import {verifyJWT} from '../middlewares/isAuth.js';
import { googleAuth, login, logout, register } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/google', googleAuth);
authRouter.post('/logout', verifyJWT, logout);


export default authRouter;

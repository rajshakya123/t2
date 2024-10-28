import express from "express"
import { loginUser,registerUser,changePassword,forgotPassword,verifyOtpAndResetPassword,setNewPassword } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post('/change-password', changePassword);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOtpAndResetPassword);
userRouter.post('/set-new-password', setNewPassword);
export default userRouter;
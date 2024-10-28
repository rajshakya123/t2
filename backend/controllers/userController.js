import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import crypto from "crypto"; // To generate OTP
import nodemailer from "nodemailer"; // To send email

// login user
const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email})

        if (!user){
            return res.json({success:false,message:"User doesn't exist."})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success:false,message:"Invalid credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user
const registerUser = async (req,res) => {
    const {name,password,email} = req.body;
    try {
        //checking if user already exists
        const exists = await userModel.findOne({email});
        if (exists){
            return res.json({success:false,message:"User already exists."})
        }

        // validating email format & strong password
        if (!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email."})
        }


        if (password.length<8){
            return res.json({success:false,message:"Please enter a strong password."})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//export {loginUser,registerUser}



// Set up your transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Generate a random OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP via email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

// Change Password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you're using middleware to get user ID from token

    try {
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Old password is incorrect." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        res.json({ success: true, message: "Password changed successfully." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred." });
    }
};


// Import the sendEmail function
import sendEmail from '../emailService.js'; // Adjust the path if necessary

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist." });
        }

        const otp = generateOtp();
        user.otp = otp; // Store OTP in user model
        await user.save();

        // Send OTP email
        const subject = 'Your Password Reset OTP';
        const message = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;

        await sendEmail(email, subject, message); // Send OTP to user's email

        res.json({ success: true, message: "OTP sent to email." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error occurred." });
    }
};





// Verify OTP and Reset Password
const verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Fetch user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist." });
        }

        // Log OTPs to check
        console.log("Stored OTP (user):", user.otp);
        console.log("Received OTP (req.body):", otp);

        // Ensure both OTPs are compared as strings
        if (user.otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP after successful reset
        user.otp = null;
        // Save the updated user info
        await user.save();
        // Respond with success
        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.json({ success: false, message: "An error occurred during password reset." });
    }
};


// Set New Password
const setNewPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = null; // Clear OTP after successful reset

        await user.save();
        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error occurred while setting new password." });
    }
};


// Export functions
export { loginUser, registerUser, changePassword, forgotPassword, verifyOtpAndResetPassword,setNewPassword };

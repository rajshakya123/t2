import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '2022msbda030@curaj.ac.in', // Gmail address
        pass: 'Shambhu123@', // Gmail App Password
    },
});

// Async function to send email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to,                       // Receiver's address
        subject: subject,             // Subject line
        text: text,                   // Plain text body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

export default sendEmail;

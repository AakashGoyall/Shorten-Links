const sgMail = require('@sendgrid/mail');
require('dotenv').config();

if (!process.env.SENDGRID_API_KEY || !process.env.SENDER_EMAIL) {
    throw new Error("Missing SENDGRID_API_KEY or SENDER_EMAIL in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates 6-digit OTP
};

const sendOTP = async (email) => {
    const otp = generateOTP();

    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL, // Ensure this email is verified in SendGrid
        subject: `Verification OTP [${otp}]`,
        html: `<div style="max-width: 500px; margin: 50px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; 
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center;">
<img src="https://lh3.googleusercontent.com/GiRiQRLCt0HvR2WuLlLUhvQS-_AxCOuoKmB11b-VTmyGjlJtL_6iyaCuL0xCp1SDwSM" 
     alt="Linkly Logo" 
     style="width: 100px; margin-bottom: 20px;" />

<h2 style="color: #333; margin-bottom: 10px;">Verify Your Linkly Account</h2>

<p style="color: #555; font-size: 16px;">Use the code below to verify your email address:</p>

<div style="background-color: #007AFF; color: #ffffff; font-size: 24px; font-weight: bold; 
            padding: 15px; display: inline-block; border-radius: 8px; margin: 20px 0;">
    ${otp}
</div>

<p style="color: #555; font-size: 14px;">If you didn’t request this code, you can ignore this email.</p>

<div style="font-size: 12px; color: #777; margin-top: 20px;">
    <p>Linkly © ${new Date().getFullYear()}. All rights reserved.</p>
</div>
</div>
`
    };

    try {
        await sgMail.send(msg);
        // console.log("OTP sent successfully to", email);
        // console.log("otp", otp)
        return otp; // Return OTP so it can be used for verification
    } catch (error) {
        console.error("Error sending OTP:", error.response ? error.response.body : error.message);
        throw new Error("Failed to send OTP");
    }
};

module.exports = sendOTP;
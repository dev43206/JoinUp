const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Booking Confirmed: ${eventTitle}',
        // we can use html instead of text to make the email look better
        text: `Hello ${userName},\n\nYour booking for ${eventTitle} has been confirmed.`
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent to ${userEmail} for booking ${eventTitle}');
    } catch (error) {        
        console.error('Error sending booking email to ${userEmail} for ${eventTitle}:', error);
    }
   
};

const sendOtpEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Account Verification OTP' : 'Event Booking OTP';
        const msg = type === 'account_verification' ? `Your OTP for account verification is: ${otp}` : `Your OTP for event booking is: ${otp}`;
        
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: title,
        // we can use html instead of text to make the email look better
        text: msg
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent to ${userEmail} for ${type}');
    } catch (error) {        
        console.error('Error sending OTP email to ${userEmail} for ${type}:', error);
    }
   
};

module.exports = {
    sendBookingEmail,
    sendOtpEmail
}; 
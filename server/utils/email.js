const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const fromEmail = process.env.EMAIL_FROM || 'JoinUp <onboarding@resend.dev>';
let resendClient;

const sendEmailInBackground = (emailPromise, context) => {
    emailPromise.catch((error) => {
        console.error(`Error sending ${context}:`, error);
    });
};

const sendEmail = async ({ to, subject, text }) => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured');
    }

    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }

    await resendClient.emails.send({
        from: fromEmail,
        to,
        subject,
        text
    });
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await sendEmail({
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            text: `Hello ${userName},\n\nYour booking for ${eventTitle} has been confirmed.`
        });

        console.log(`Email sent to ${userEmail} for booking ${eventTitle}`);
    } catch (error) {
        console.error(`Error sending booking email to ${userEmail} for ${eventTitle}:`, error);
    }
};

const sendOtpEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Account Verification OTP' : 'Event Booking OTP';
        const msg = type === 'account_verification' ? `Your OTP for account verification is: ${otp}` : `Your OTP for event booking is: ${otp}`;

        await sendEmail({
            to: userEmail,
            subject: title,
            text: msg
        });

        console.log(`OTP email sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${userEmail} for ${type}:`, error);
    }
};

module.exports = {
    sendBookingEmail,
    sendOtpEmail,
    sendEmailInBackground
};

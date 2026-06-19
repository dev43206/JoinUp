const User = require('../models/User');
const Otp = require('../models/otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/email');

const generateToken = (id,role) => {
    // Token generation logic here
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    try {
        const user = await User.create({ name, email, password: hashedPassword, role: 'user' ,isverified: false});

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`);
        await Otp.create({ email, otp, action: 'account_verification' });
        await sendOtpEmail(email, otp, 'account_verification');

        res.status(201).json({ message: 'User registered successfully. Please verify your email.',
            email: user.email
         });   



    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials Please sign up first' });
        } 
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials : Incorrect Password' });
        }
    
        if(!user.isverified && user.role === 'user') {
    
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await Otp.deleteMany({ email, action: 'account_verification' });
            await Otp.create({ email, otp, action: 'account_verification' });
            await sendOtpEmail(email, otp, 'account_verification');
    
            return res.status(400).json({
                message: 'Account not verified. Please check your email for the OTP to verify your account.',
                needsVerification: true
            });
                
        }
    
        res.json({ message: 'Login successful', 
            _id: user._id, name: user.name,
            email: user.email, role: user.role,
            token: generateToken(user._id,user.role)
        });
    } catch (error) {
        res.status(500).json({message : 'Server Error',error: error.message});
    }
        
};



exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await Otp.findOne({ email, otp, action: 'account_verification' });
    
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    
        const user = await User.findOneAndUpdate({ email }, { isverified: true },{new: true});
        await Otp.deleteOne({_id: otpRecord._id}); // remove used OTPs
    
        res.json({ 
            message: 'Account verified successfully. You can now log in.' ,
            _id: user._id, name: user.name,
            email: user.email, role: user.role,
            token: generateToken(user._id,user.role)
        });
    } catch (error) {
        res.status(500).json({message : 'Server Error'});
    }
}

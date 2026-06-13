const Booking = require('../models/Bookings.js');
const Otp = require('../models/Otp');
const Event = require('../models/Events');
const {sendOtpEmail, sendBookingEmail} = require('../utils/email');

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendBookingOtp = async (req, res) => {
    const otp1 = generateOtp();
    await Otp.findOneAndDelete({email:req.user.email,action:'event_booking'});
    await Otp.create({email:req.user.email,otp:otp1,action:'event_booking'});
    await sendOtpEmail(req.user.email, otp1, 'event_booking');

    res.json({message: 'Otp sent to email'});
        
   
};


exports.bookEvent = async (req,res) =>{
    const {eventId, otp} = req.body;
    const otpRecord = await Otp.findOne({ email: req.user.email, otp, action: 'event_booking' });

    if(!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const event = await Event.findById(eventId);
    if(!event){
        return res.status(404).json({ error: 'Event not found' });
    }

    if(event.totalSeats <= 0){
        return res.status(400).json({ error: 'No seats available for this event' });
    }

    const existingBooking = await Booking.findOne({ user: req.user._id, event: eventId });
    if(existingBooking){
        return res.status(400).json({ error: 'You have already booked this event' });
    }

    const booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: event.ticketPrice
    });
    await Otp.deleteMany({email:req.user.email,action:'event_booking'});
    res.status(201).json({message: 'Booking created.Please check your email for booking confirmation.'});

}

exports.confirmBooking = async (req,res)=>{
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if(!booking){
}
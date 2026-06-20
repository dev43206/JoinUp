const Booking = require('../models/Bookings.js');
const Otp = require('../models/otp');
const Event = require('../models/Events');
const {sendOtpEmail, sendBookingEmail, sendEmailInBackground} = require('../utils/email');

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendBookingOtp = async (req, res) => {
    const otp1 = generateOtp();
    await Otp.findOneAndDelete({email:req.user.email,action:'event_booking'});
    await Otp.create({email:req.user.email,otp:otp1,action:'event_booking'});
    sendEmailInBackground(
        sendOtpEmail(req.user.email, otp1, 'event_booking'),
        `event booking OTP to ${req.user.email}`
    );

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

    const existingBooking = await Booking.findOne({ userId: req.user._id, eventId });
    if(existingBooking){
        return res.status(400).json({ error: 'You have already booked this event' });
    }

    const booking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'not_paid',
        amount: event.ticketPrice
    });
    await Otp.deleteMany({email:req.user.email,action:'event_booking'});
    res.status(201).json({message: 'Booking request submitted', booking});

}


// bookEvent = async (req, res) => {
//     try {
//         const { eventId, otp } = req.body;

//         // Verify OTP explicitly before proceeding
//         const validOTP = await OTP.findOne({ email: req.user.email, otp, action: 'event_booking' });
//         if (!validOTP) {
//             return res.status(400).json({ message: 'Invalid or expired OTP for booking' });
//         }

//         const event = await Event.findById(eventId);
//         if (!event) return res.status(404).json({ message: 'Event not found' });
//         if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

//         const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
//         if (existingBooking && existingBooking.status !== 'cancelled') {
//             return res.status(400).json({ message: 'Already booked or pending' });
//         }

//         const booking = await Booking.create({
//             userId: req.user.id,
//             eventId,
//             status: 'pending',
//             paymentStatus: 'not_paid',
//             amount: event.ticketPrice
//         });

//         await OTP.deleteOne({ _id: validOTP._id }); // cleanup

//         res.status(201).json({ message: 'Booking request submitted', booking });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

exports.confirmBooking = async (req,res)=>{
    const paymentStatus = req.body.paymentStatus;
    if(!['paid','not_paid'].includes(paymentStatus)){
        return res.status(400).json({error: 'Invalid payment status'});
    }
    const booking = await Booking.findById(req.params.id).populate('eventId').populate('userId', 'name email');
    if(!booking){
        return res.status(404).json({error: 'Booking not found'});
    }
    if(booking.status === 'confirmed'){
        return res.status(400).json({error: 'Booking already confirmed'});
    }

    const event = await Event.findById(booking.eventId._id);
    if(event.totalSeats <= 0){
        return res.status(400).json({error: 'No seats available'});
    }

    booking.status = 'confirmed';
    if(paymentStatus){
        booking.paymentStatus = paymentStatus;
    }
    await booking.save();
    event.totalSeats -= 1;
    await event.save();

    //admin confirmation email to user
    sendEmailInBackground(
        sendBookingEmail(booking.userId?.email || req.user.email, booking.userId?.name || 'there', event.title),
        `booking confirmation to ${booking.userId?.email || req.user.email}`
    );

    res.json({message: 'Booking confirmed'})
};


exports.getMyBookings = async (req, res) => {
    try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user.id }).populate('eventId').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.cancelBooking = async(req,res) =>{
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if(!booking){
        return res.status(404).json({error: 'Booking not found'});
    }

    if(booking.userId.toString() !== req.user._id.toString()){
        return res.status(403).json({error:'Unauthorized'});
    }

    const wasConfirmed = booking.status === 'confirmed';
    booking.status = 'cancelled';
    await booking.save();

    if(wasConfirmed){
        const event = await Event.findById(booking.eventId._id);
        event.totalSeats += 1;
        await event.save();
    }

    await booking.remove();
    res.json({message: 'Booking cancelled'});
}

const express = require('express');
const router = express.Router();
const {protect,admin} = require('../middleware/auth.js');

const {bookEvent,verifyOtp,getMyBookings,confirmBooking,cancelBooking} = require('../controllers/bookingController.js');


router.post('/',protect,bookEvent);
router.post('/send-otp',protect,verifyOtp);
router.get('/my',protect,getMyBookings);
router.put('/:id/confirm',protect,confirmBooking);
router.delete('/:id',protect,cancelBooking);

module.exports = router;
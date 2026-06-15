const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middleware/auth.js');
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent} = require('../controllers/eventController.js')

// Get all events
router.get('/',getEvents);

// Get event by ID
router.get('/:id', getEventById);

// Create new event (admin only)
router.post('/', protect, admin, createEvent);


// update event (admin only)
router.put('/:id', protect,admin,updateEvent);

// delete event (admin only)
router.delete('/:id',protect,admin, deleteEvent);

module.exports = router;
const Event = require('../models/Events');

getEvents = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.search) filters.title = { $regex: req.query.search, $options: 'i' };

        const events = await Event.find(filters).populate('createdBy', 'name email');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};




getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// createEvent = async (req, res) => {

//     try{


//         // change karne hai according to real requirement i have to make filters
//         const filters = {};
//         if(req.query.category){
//             filters.category = req.query.category;
//         }
//         if(req.query.ticketPrice){
//             filters.ticketPrice = req.query.ticketPrice;
//         }

//         const events = await Event.find(filters);
//         res.json(events);
//     }catch(error){
//         res.status(500).json({ error: error.message });
//     }

// };

createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, totalSeats, ticketPrice, image } = req.body;
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const { title, description, date, location, category, totalSeats, ticketPrice, image } = req.body;

        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (date !== undefined) event.date = date;
        if (location !== undefined) event.location = location;
        if (category !== undefined) event.category = category;
        if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
        if (image !== undefined) event.image = image;

        if (totalSeats !== undefined) {
            const nextTotalSeats = Number(totalSeats);
            event.totalSeats = nextTotalSeats;
            event.availableSeats = Math.min(event.availableSeats ?? nextTotalSeats, nextTotalSeats);
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 

deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
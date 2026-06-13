const Event = require('../models/Event');

exports.createEvent = async (req, res) => {

    try{


        // change karne hai according to real requirement i have to make filters
        const filters = {};
        if(req.query.category){
            filters.category = req.query.category;
        }
        if(req.query.ticketPrice){
            filters.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find(filters);
        res.json(events);
    }catch(error){
        res.status(500).json({ error: error.message });
    }

};


exports.getEventById = async (req, res) => {
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

exports.updateEvent = async (req, res) => {
    const { title, description, date, location, category, ticketPrice } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id,{
            title,
            description,
            date,
            location,
            category,
            ticketPrice,
            totalSeats,
            imaegeUrl
         },{new: true
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteEvent = async (req, res) => {
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
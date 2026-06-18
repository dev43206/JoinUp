import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-black text-white rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.pexels.com/photos/6782328/pexels-photo-6782328.jpeg')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
                    <span className="bg-white/62 text-black backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">Welcome to JoinUp</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
                        The Place Where <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Great EVENTS</span> Begins
                    </h1>
                    <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover experiences that bring people together.
                    </p>

                    <div className="w-full  max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-gray-500 text-xl group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            className="w-full pl-16 pr-6 py-1 rounded-full text-lg text-black bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-gray-500 focus:outline-none transition-all placeholder-gray-400 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Why Choose Us / Features row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
                <div className="bg-[#444346]/67 p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-[#130F0F] text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-900">
                        <FaRegClock />
                    </div>
                    <h3 className="text-xl font-bold text-[#2EF82B]/71 mb-3">Discover Amazing Events</h3>
                    <p className="text-white text-sm leading-relaxed">Explore concerts, workshops, conferences, meetups, and more—all tailored to your interests.</p>
                </div>
                <div className="bg-[#444346]/67 p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-[#130F0F] text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-900">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-xl font-bold text-[#2EF82B]/71 mb-3">Connect With Communities</h3>
                    <p className="text-white text-sm leading-relaxed">Meet like-minded people, expand your network, and create memorable experiences through events you love.</p>
                </div>
                <div className="bg-[#444346]/67 p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition duration-300">
                    <div className="w-16 h-16 bg-[#130F0F] text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md shadow-gray-900">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-xl font-bold text-[#2EF82B]/71 mb-3">Personalized Experience</h3>
                    <p className="text-white text-sm leading-relaxed">Get event recommendations based on your interests and never miss opportunities that matter to you.</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2 border-b border-white pb-4">
                <h2 className="text-3xl font-extrabold text-white">Upcoming Events</h2>
                <div className="text-gray-500 font-medium">{events.length} results found</div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-xl font-semibold text-gray-600">Loading events...</div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-xl bg-[#444346]/67">No events found matching your search.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <div key={event._id} className="bg-[#444346]/67 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col hover:-translate-y-1">
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-[#130F0F] backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                    {event.ticketPrice === 0 ? <span className="text-[#2EF82B]/71">FREE</span> : <span className="text-white">₹{event.ticketPrice}</span>}
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col ">
                                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">{event.category}</div>
                                <h2 className="text-xl font-bold text-[#2EF82B]/71 mb-3">{event.title}</h2>
                                <div className="flex flex-col gap-2 mb-4 text-white text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-white" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="w-full bg-white rounded-full h-2 mb-2">
                                        <div className="bg-[#2EF82B]/71 h-2 rounded-full" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-white mb-4">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                    <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Section */}
            <footer className="mt-auto pt-16 pb-8 border-t border-gray-200 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaTicketAlt className="text-white text-2xl" />
                    <span className="text-xl font-bold text-[#2EF82B]/71">JoinUp</span>
                </div>
                <p className="text-white text-sm mb-6 max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="text-xs text-white font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} JoinUp Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
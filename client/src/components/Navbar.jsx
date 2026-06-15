import React from 'react'
import {Link,useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {FaTicketAlt} from 'react-icons/fa'
import { useContext } from 'react';


function Navbar() {

    const {user,logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout();
        navigate('/login');
    }

    return (
        <nav className='bg-gray-900 shadow-lg'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col md:flex-row justify-between items-center py-4 gap-4'>
                    
                </div>
            </div>
        </nav>
    
    );
}

export default Navbar
import React, { useState } from 'react'
import './Navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/profile.jpg'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({setSidebar}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className='nav-list'>
            <div className="nav-left nav-list">
                <img className='menu-icon' onClick={()=>setSidebar(prev=>prev===false?true:false)} src={menu_icon} alt="" />
                <Link to='/'><img className='logo' src={logo} alt="" /></Link>
            </div>
            <div className="nav-middle nav-list">
                <form className="search-box nav-list" onSubmit={handleSearch}>
                    <input 
                        type='text' 
                        placeholder='Search' 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                        <img src={search_icon} alt="Search" />
                    </button>
                </form>
            </div>
            <div className="nav-right nav-list">
                <img src={upload_icon} alt="" />
                <img src={more_icon} alt="" />
                <img src={notification_icon} alt="" />
                <img className='profile' src={profile_icon} alt="" />
            </div>
        </nav>
    )
}

export default Navbar

import React from 'react'
import menu from '../assets/menu.png'
import logo from '../assets/logo.png'
import search_icon from '../assets/search.png'
import upload_icon from '../assets/upload.png'
import more_icon from '../assets/more.png'
import notification_icon from '../assets/notification.png'
import profile_icon from '../assets/jack.png'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'

const Navbar = ({setSidebar}) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-0 sm:px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        {/* Left section - Menu and Logo */}
        <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu onClick={()=>setSidebar(prev => prev === false? true :false)}
                src={menu} alt="Menu" className="w-6 h-6" />
                
            </button>
            <Link to='/' className="flex items-center">
                <img src={logo} alt="YouTube" className="h-6 sm:h-8 w-auto" />
                <h4 className='font-bold ml-2 text-xl sm:text-2xl'>YouTube</h4>

            </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-5 sm:mx-8">
            <div className="relative flex">
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="px-2 sm:px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors">
                    <img src={search_icon} alt="Search" className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Right section - Actions and Profile */}
        <div className="sm:flex items-center space-x-2 hidden">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <img src={upload_icon} alt="Upload" className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <img src={more_icon} alt="More" className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <img src={notification_icon} alt="Notifications" className="w-6 h-6" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <img src={profile_icon} alt="Profile" className="w-8 h-8 rounded-full" />
            </button>
        </div>
    </nav>
  )
}

export default Navbar
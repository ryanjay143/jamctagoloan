import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Footer from '../user/layouts/Footer'
import img from '../../assets/image.jpg'
import NavLinkForTithes from '../user/layouts/NavLinkForTithes'

function TithesContainer() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
      const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };


  return (
    <div className="flex flex-col min-h-screen">
    <div className="flex items-center justify-between py-4 bg-white shadow-md md:mt-16">
      <div className="text-2xl font-bold ml-64 md:ml-0">Tithes & Offering</div>
      <nav className="relative flex space-x-4">
        <div className="relative">
          <button onClick={toggleDropdown} className="flex shadowm-md rounded-md p-1 border-b-4 items-center focus:outline-none">
            <Avatar>
              <AvatarImage src={img} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>

    <div className="flex-grow bg-gray-100">
      <div className="flex items-center justify-between mb-4">
        <NavLinkForTithes />
      </div>
      <div>
        <Outlet />
      </div>
    </div>

    <Footer />
  </div>
  )
}

export default TithesContainer

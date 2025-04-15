import { faBars, faEnvelopeCircleCheck, faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png"

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/jamc/tagoloan", icon: faListCheck, label: "Attendance" },
    { path: "/jamc/tagoloan/tithes-offering", icon: faEnvelopeCircleCheck, label: "Tithes & Offering" },
  ];

  const handleNavigation = (path: any) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`hidden md:flex fixed top-4 md:fixed left-4 z-50 bg-white text-accent p-2 rounded-md shadow-md ${
          isOpen ? "hidden" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`${isOpen ? "p-1.5 rounded" : ""}`}>
          <FontAwesomeIcon className={`${isOpen ? "text-red-700 font-extrabold" : "text-[#172554]"}`} icon={isOpen ? faTimes : faBars} size="lg" />
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed h-full bg-primary text-accent md:z-40 z-9999 transition-opacity duration-75 ease-in-out ${
          isOpen ? "w-[240px] opacity-100" : "w-[230px] opacity-100"
        } md:w-[240px] md:opacity-100 slg:w-[230px] slg:opacity-100 md:flex md:rounded-r-[5px] rounded-r-[5px] overflow-hidden ${
          !isOpen && "md:hidden"
        } md:transition-all md:ease-in-out`}
      >
        <div className="w-full h-full flex flex-col items-center justify-between py-4">
          {/* Logo Section */}
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => handleNavigation("/jamc/tagoloan/user-dashboard")}
          >
            <img src={logo} alt="Logo" className="w-42 h-28 rounded-2xl" />
          </div>
          {/* <hr className="w-48 border-white" /> */}

          {/* Navigation Menu */}
          <nav className="w-full">
            <ul className="relative mb-12 w-full flex flex-col items-center gap-y-2">
              {links.map((link) => (
                <li
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`w-[220px] text-[#eff6ff] rounded-md flex justify-center items-center transition duration-200 ${
                  location.pathname.startsWith(link.path)
                    ? "bg-[#172554] text-[#172554] border border-primary"
                    : "hover:bg-[#172554] hover:text-[#eff6ff] border border-primary"
                }`}
              >
                <div className="flex items-center gap-3 text-xl w-full px-4 py-2 cursor-pointer">
                  <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
              </li>
              ))}
            </ul>
          </nav>

          
         

          <div className="text-center text-sm text-[#eff6ff]">
            © {new Date().getFullYear()} JAMC Tagoloan
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:transition-opacity md:duration-300 md:ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default AdminSidebar;
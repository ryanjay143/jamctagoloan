import { faBars, faDashboard, faEnvelopeCircleCheck, faListCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "#", icon: faDashboard, label: "Dashboard" },
    { path: "/jamctagoloan", icon: faListCheck, label: "Attendance" },
    { path: "/jamctagoloan/tithes-offering", icon: faEnvelopeCircleCheck, label: "Tithes & Offering" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (linkPath: string): boolean => {
    if (linkPath === "/jamctagoloan") {
      return (
        location.pathname === "/jamctagoloan" ||
        location.pathname.startsWith("/jamctagoloan/attendance")
      );
    }
    if (linkPath === "/jamctagoloan/tithes-offering") {
      return location.pathname.startsWith("/jamctagoloan/tithes-offering");
    }
    return location.pathname === linkPath;
  };

  return (
    <>
      <button
        className={`fixed top-4 left-4 z-50 bg-white text-accent p-2 rounded-md shadow-md transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 scale-100 md:block" : "opacity-100 scale-100 hidden md:block"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars}
          className={isOpen ? "text-red-500" : "text-primary"}
          size="lg"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-primary text-accent z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : " w-60 md:-translate-x-full"
        } md:w-56 overflow-hidden rounded-r-[5px]`}
      >
        <div className="flex flex-col justify-between h-full py-4">
          {/* Logo */}
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => handleNavigation("/jamctagoloan/attendance")}
          >
            <img src={logo} alt="Logo" className="w-36 h-24 rounded-2xl object-contain" />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col items-center mt-5 px-2">
            {links.map((link) => (
              <li
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`w-full max-w-[220px] rounded-md px-4 py-2 cursor-pointer flex items-center gap-3 text-lg
                  ${isActive(link.path)
                    ? "bg-[#eff6ff] text-primary border"
                    : "hover:bg-[#eff6ff] text-[#eff6ff] hover:text-primary border"
                  } border-primary`}
              >
                <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                <span>{link.label}</span>
              </li>
            ))}
          </nav>

          <div className="text-center text-sm text-[#eff6ff] mt-auto">
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
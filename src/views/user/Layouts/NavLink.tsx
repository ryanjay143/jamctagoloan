import { Link, useLocation } from "react-router-dom";
import { navItems } from "@/helper/navItems";

const NavLink = () => {
  const location = useLocation();

  return (
    <div className='flex items-center justify-start ml-60 mx-auto md:ml-0 md:mt-5 md:w-full'>
      <nav className="flex flex-row md:grid-cols-3 md:grid gap-4 pt-5 md:pt-0 md:overflow-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-3 py-2 rounded-md md:text-[12px] text-[#172554] hover:bg-[#dbeafe] ${
              location.pathname === item.to ? "bg-[#dbeafe] font-bold" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavLink;
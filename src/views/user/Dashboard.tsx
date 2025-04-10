

import { Outlet } from "react-router-dom";
import NavLink from "./Layouts/NavLink";

function Dashboard() {
  return (
    <div className='flex flex-col p-5 items-start justify-start h-screen'>
      <div className='border border-light border-b-4 bg-primary shadow-md rounded-lg p-3 w-[82%] ml-60 mx-auto md:ml-0 md:mt-14 md:w-full'>
        <h2 className='text-2xl font-bold mb-4 text-white'>Church Attendance Dashboard</h2>
        <p className='text-white'>Welcome to JAMC Tagoloan</p>
      </div>
      <NavLink />
      <Outlet />
    </div>
  );
}

export default Dashboard;
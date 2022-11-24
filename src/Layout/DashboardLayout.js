import React from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../Pages/Share/Header/Header";

const DashboardLayout = () => {
  const sidebar = true;

  return (
    <div>
      <Header>{sidebar}</Header>
      <div className='drawer drawer-mobile'>
        <input
          id='dashboard_drawer'
          type='checkbox'
          className='drawer-toggle'
        />

        <div className='drawer-content p-10'>
          <Outlet></Outlet>
        </div>
        <div className='drawer-side h-screen mt-2'>
          <label htmlFor='dashboard_drawer' className='drawer-overlay'></label>
          <ul className='menu p-4 w-80 bg-base-200 text-base-content font-semibold'>
            <li>
              <Link>Sidebar Item 1</Link>
            </li>
            <li>
              <Link>Sidebar Item 2</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

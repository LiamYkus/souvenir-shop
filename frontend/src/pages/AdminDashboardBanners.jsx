import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllBanners from "../components/Admin/AllBanners";

const AdminDashboardBanners = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={10} />
        </div>

        <div className="w-full flex">
          <AllBanners />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardBanners;

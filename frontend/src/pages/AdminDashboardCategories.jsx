import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllCategories from "../components/Admin/AllCategories";

const AdminDashBoardCategories = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={12} />
        </div>

        <div className="w-full flex">
          <AllCategories />
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoardCategories;

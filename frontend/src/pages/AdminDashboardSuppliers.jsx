import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllSuppliers from "../components/Admin/AllSuppliers";

const AdminDashboardSuppliers = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={11} />
        </div>

        <div className="w-full flex">
          <AllSuppliers />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSuppliers;

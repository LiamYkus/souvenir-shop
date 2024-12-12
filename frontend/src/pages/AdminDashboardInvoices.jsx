import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllInvoices from "../components/Admin/AllInvoices";

const AdminDashboardInvoices = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={9} />
        </div>

        <div className="w-full justify-center flex">
          <AllInvoices />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardInvoices;

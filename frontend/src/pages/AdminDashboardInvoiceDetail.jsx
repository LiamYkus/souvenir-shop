import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import InvoiceDetail from "../components/Admin/InvoiceDetail";

const AdminDashboardInvoiceDetail = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={9} />
        </div>

        <div className="w-full justify-center flex">
          <InvoiceDetail />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardInvoiceDetail;

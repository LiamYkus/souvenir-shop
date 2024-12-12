import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreatePurchaseInvoice from "../../components/Shop/CreatePurchaseInvoice";

const ShopCreatePurchaseInvoice = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex w-full">
        <div className="w-[330px]">
          <DashboardSideBar active={13} />
        </div>
        <div className="w-full">
          <CreatePurchaseInvoice />
        </div>
      </div>
    </div>
  );
};

export default ShopCreatePurchaseInvoice;

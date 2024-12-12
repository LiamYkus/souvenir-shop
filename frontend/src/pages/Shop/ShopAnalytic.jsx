import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import Analytic from "../../components/Shop/Analytic";

const ShopAnalytic = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={14} />
        </div>
        <div className="w-full flex">
          <Analytic />
        </div>
      </div>
    </div>
  );
};

export default ShopAnalytic;

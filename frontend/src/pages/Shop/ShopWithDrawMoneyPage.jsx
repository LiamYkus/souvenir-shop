import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";

const ShopWithDrawMoneyPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[330px]">
          <DashboardSideBar active={7} />
        </div>
        <div className="w-full justify-center flex">
          <WithdrawMoney />
        </div>
      </div>
    </div>
  );
};

export default ShopWithDrawMoneyPage;

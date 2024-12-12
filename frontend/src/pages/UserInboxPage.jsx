import React from "react";
import Header from "../components/Layout/Header";
import DashboardSideBar from "../components/Shop/Layout/DashboardSideBar";
import UserInbox from "./UserInbox";

const UserInboxPage = () => {
  return (
    <div>
      <Header />
      <UserInbox />
    </div>
  );
};

export default UserInboxPage;

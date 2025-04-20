import React from "react";
import { useSelector } from "react-redux";

import { ImProfile } from "react-icons/im";
import { FaHome, FaBug } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";
import { FaTools } from "react-icons/fa";

const allLinks = [
  {
    text: "home",
    path: ".",
    icon: <FaHome />,
  },
  {
    text: "Report Issue",
    path: "report",
    icon: <FaBug />,
  },
  {
    text: "Leaderboard",
    path: "leaderboard",
    icon: <MdLeaderboard />,
  },
  {
    text: "profile",
    path: "profile",
    icon: <ImProfile />,
  },
  {
    text: "Issues Resolved By Voluteers",
    path: "resolved",
    icon: <FaTools />,
  },
  {
    text: "Admin Dashboard",
    path: "admindashboard",
    icon: <GrUserAdmin />,
    isAdminOnly: true,
  },
];

const useLinks = () => {
  const loggedinUser = useSelector((state) => state.user.loggedinUser);

  if (!loggedinUser) return [];

  return loggedinUser.isAdmin
    ? allLinks.filter((link) => link.isAdminOnly)
    : allLinks.filter((link) => !link.isAdminOnly);
};

export default useLinks;

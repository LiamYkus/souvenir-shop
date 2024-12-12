import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/data";

const Navbar = ({ active }) => {
  return (
    <div className="block 800px:flex">
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex">
            <Link
              to={i.url}
              className={`${
                active === index + 1
                  ? "text-black font-bold 800px:text-white"
                  : "text-dark-gray 800px:text-black"
              } text-xl font-bold hover:text-[#e60049] cursor-pointer m-4 }`}
            >
              {i.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;

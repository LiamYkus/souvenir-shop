import React from "react";
import { FaFacebook } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-center p-10 border">
      <aside>
        <img
          src="https://theme.hstatic.net/1000069863/1000993714/14/logo.png?v=448"
          className="w-24 h-24 object-cover"
        />
        <p className="font-bold">
          Chip Chip. <br />
          ChipChip Souvenir Shop
        </p>
        <p>
          Địa chỉ: 597 Nguyễn Đình Chiểu, Phường 2, Quận 3 - Tp.HCM
        </p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link to={"https://chipchipshop.com/pages/ve-chip-chip"}>
            <FaFacebook color="#3B5998" size={36} />
          </Link>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;

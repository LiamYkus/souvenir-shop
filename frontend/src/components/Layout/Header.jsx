import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShopify,
  FaSearchengin,
  FaArrowRight,
  FaHeart,
  FaCartShopping,
  FaUserAstronaut,
  FaBars,
  FaArrowLeft,
} from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { backend_url } from "../../server";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

import { TbAdjustmentsHorizontal, TbArrowBarLeft } from "react-icons/tb";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      <div className="mx-24">
        <div className="hidden 800px:h-[50px] 800px:py-10 800px:flex items-center justify-between">
          <div>
            <Link to="/" className="flex">
              <FaShopify size={36} color="#50e991" />
              <h1 className="text-4xl font-bold uppercase italic">ChipChip</h1>
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Tìm sản  phẩm..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#0bb4ff] border-[2px] rounded-md"
              ref={inputRef}
              onClick={handleInputClick}
            />
            <FaSearchengin
              size={24}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {isOpen && searchData && searchData.length !== 0 ? (
              <div className="absolute bg-white shadow z-[9] p-4 w-full rounded">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`}>
                        <div className="w-full flex items-start py-2">
                          <img
                            src={`${backend_url}${i.images[0]}`}
                            alt=""
                            className="w-12 h-12 object-cover rounded"
                          />
                          <h1 className="ml-2 font-bold">{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div className="flex items-center flex-col">
            <button className="btn">
              {isSeller ? (
                <Link to={"/dashboard"}>
                  <h1 className="text-lg text-black flex items-center">
                    Quản Lý
                    <FaArrowRight className="ml-2" />
                  </h1>
                </Link>
              ) : (
                <Link to={"/shop-login"}>
                  <h1 className="text-lg text-black flex items-center">
                    {"Đăng nhập vào cửa hàng"} <FaArrowRight className="ml-2" />
                  </h1>
                </Link>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#50e991]">
        <div className="mx-24 hidden 800px:flex justify-between">
          {/* navitems */}
          <div>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex items-center">
            <div className="flex">
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <FaHeart color="#e60049" size={36} />
                <span className="absolute right-0 top-0 rounded-full bg-[#0bb4ff] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>
            <div className="flex">
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <FaCartShopping size={36} color="#e6d800" />
                <span className="absolute right-0 top-0 rounded-full bg-[#0bb4ff] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className="flex">
              <div className="relative cursor-pointer mr-[20px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={`${backend_url}${user?.avatar}`} />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link to="/login">
                    <FaUserAstronaut size={35} color="#0bb4ff" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-12 z-999 bg-white top-0 left-0 shadow 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <FaBars size={36} onClick={() => setOpen(true)} />
          </div>
          <div>
            <Link to="/" className="flex">
              <FaShopify size={36} color="#50e991" />
              <h1 className="text-4xl font-bold uppercase italic">ChipChip</h1>
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <FaCartShopping size={36} />
              <span class="absolute right-0 top-0 rounded-full bg-blue w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-extra-light-gray z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-extra-extra-light-gray h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <FaHeart size={36} className="mt-5 ml-3" />
                    <span class="absolute right-0 top-0 rounded-full bg-blue w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <FaArrowLeft
                  size={36}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px relative]">
                <input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="h-[40px] w-full px-2 border-blue border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  ref={inputRef}
                  onClick={handleInputClick}
                />
                {isOpen && searchData && searchData.length !== 0 ? (
                  <div className="absolute bg-slate-50 shadow-sm-2 z-[9] p-4 w-full">
                    {searchData &&
                      searchData.map((i, index) => {
                        return (
                          <Link to={`/product/${i._id}`}>
                            <div className="w-full flex items-start-py-3">
                              <img
                                src={`${backend_url}${i.images[0]}`}
                                alt=""
                                className="w-[40px] h-[40px] mr-[10px]"
                              />
                              <h1>{i.name}</h1>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                ) : null}
              </div>
              <Navbar active={activeHeading} />
              <Link to="/shop-create">
                <button className="btn btn-outline btn-accent font-bold ml-4">
                  Seller
                </button>
              </Link>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${backend_url}${user.avatar}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-blue"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-dark-gray hover:text-blue"
                    >
                      Đăng nhập /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-dark-gray hover:text-blue"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;

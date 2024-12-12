import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { addTocart } from "../../redux/actions/cart";
import currency from "currency-formatter";
import { FaCartShopping, FaHeart, FaX } from "react-icons/fa6";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <FaX
                size={24}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Giỏ hàng yêu thích trống!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <FaX
                  size={24}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Item length */}
              <div className="flex items-center p-4">
                <FaHeart size={24} color="red" />
                <h5 className="font-bold ml-2">
                  {wishlist && wishlist.length} Sản phẩm
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.price * value;

  return (
    <div className="border-b p-4">
      <div className="flex w-full 800px:flex items-center">
        <FaX
          size={36}
          color="red"
          className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset']"
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={`${backend_url}${data?.images[0]}`}
          alt=""
          className="w-[130px] mx-2 h-min rounded"
        />

        <div className="font-bold mx-2">
          <h1>{data.name}</h1>
          <h4 className="text-accent">
            {`${currency.format(totalPrice, { code: "VND" })}`}
          </h4>
        </div>
        <div>
          <FaCartShopping
            size={36}
            className="cursor-pointer mx-2"
            tile="Add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

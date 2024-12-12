import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import currency from "currency-formatter";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("VN");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [price, setOriginalPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (address1 === "" || country === "" || city === "") {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
    } else {
      const shippingAddress = {
        address1,
        phoneNumber,
        // address2,
        // zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        price,
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.02;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Mã voucher không hợp lệ cho cửa hàng này!");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.price,
            0
          );
          const price = (eligiblePrice * couponCodeValue) / 100;
          setOriginalPrice(price);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Mã Voucher này không tồn tại!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? price : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);


  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            // address2={address2}
            setAddress2={setAddress2}
            // zipCode={zipCode}
            // setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <button
        onClick={paymentSubmit}
        className="btn btn-accent font-bold text-white uppercase"
      >
        Thanh toán
      </button>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  phoneNumber,
  setPhoneNumber,
  // address2,
  // setAddress2,
  // zipCode,
  // setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-xl font-bold text-center uppercase">
        Thông tin giao hàng
      </h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Tên khách hàng:</label>
            <input
              type="text"
              value={user && user.name}
              required
              className="w-full border p-1 rounded-[5px] !w-[95%]"
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email:</label>
            <input
              type="email"
              value={user && user.email}
              required
              className="w-full border p-1 rounded-[5px]"
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Số điện thoại:</label>
            <input
              type="number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-1 rounded-[5px] !w-[95%]"
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Tỉnh, thành phố:</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Chọn tỉnh, thành phố
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Khu vực:</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Chọn khu vực
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Địa chỉ:</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full border p-1 rounded-[5px] !w-[95%]"
            />
          </div>
        </div>

        <div></div>
      </form>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Tổng tiền:</h3>
        <h5 className="text-[18px] font-[600]">
          {currency.format(subTotalPrice, { code: "VND" })}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">
          Phí giao hàng:
        </h3>
        <h5 className="text-[18px] font-[600]">
          {currency.format(shipping.toFixed(2), { code: "VND" })}
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Voucher:</h3>
        <h5 className="text-[18px] font-[600]">
          -
          {discountPercentenge
            ? "" +
              `${currency.format(discountPercentenge.toString(), {
                code: "VND",
              })}`
            : null}
        </h5>
      </div>
      <h3 className="text-[16px] font-[400] text-[#000000a4]">Tổng cộng:</h3>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        {" "}
        {currency.format(totalPrice, { code: "VND" })}
      </h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input input-bordered input-accent w-full"
          placeholder="Áp dụng mã Voucher ngay!!! "
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        {/* <input
          className={`w-full h-[40px] border border-success text-center text-success font-bold rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Áp dụng mã voucher"
          type="submit"
        /> */}
        <button
          type="submit"
          className="btn btn-accent text-white font-bold uppercase w-full my-2"
        >
          Áp dụng mã voucher
        </button>
      </form>
    </div>
  );
};

export default Checkout;

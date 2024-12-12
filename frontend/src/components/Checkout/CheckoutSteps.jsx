import React from "react";

const CheckoutSteps = ({ active }) => {
  console.log(active);
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap">
        <div className="flex items-center">
          <div className="px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer">
            <span className="text-white font-bold">1.Kiểm tra thông tin </span>
          </div>
          <div
            className={`${
              active > 1
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`${
              active > 1
                ? "px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer"
                : "px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer !bg-[#FDE1E6]"
            }`}
          >
            <span
              className={`${
                active > 1
                  ? "text-white font-bold"
                  : "text-white font-bold !text-[#f63b60]"
              }`}
            >
              2.Thanh toán
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className={`${
              active > 3
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
            }`}
          />
          <div
            className={`${
              active > 2
                ? "px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer"
                : "px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer !bg-[#FDE1E6]"
            }`}
          >
            <span
              className={`${
                active > 2
                  ? "text-white font-bold"
                  : "text-white font-bold !text-[#f63b60]"
              }`}
            >
              3.Thành công
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;

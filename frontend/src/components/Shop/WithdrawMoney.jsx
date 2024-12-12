import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";
import currency from "currency-formatter";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState();
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    // bankCountry: "",
    // bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });
  const navigate = useNavigate();

  const availableBalance = seller?.availableBalance.toFixed(2);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      // bankCountry: bankInfo.bankCountry,
      // bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Phương thức rút tiền đã được thêm thành công!");
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          // bankCountry: "",
          // bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Phương thức rút tiền đã được xóa thành công!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("Bạn không có đủ số dư để rút tiền!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50000 || withdrawAmount > seller?.availableBalance) {
      toast.error("Bạn không thể rút số tiền này!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(
            "Yêu cầu rút tiền thành công. Vui lòng đợi một chút để hoàn thành."
          );
        })
        .then((res) => setOpen(false))
        .then((res) =>
          setTimeout(() => {
            window.location.reload();
          }, 3000)
        );
    }
  };

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="font-bold text-xl uppercase">
          <h4>
            Số dư khả dụng:{" "}
            {`${currency.format(availableBalance, { code: "VND" })}`}
          </h4>
        </h5>
        {availableBalance < 50000 ? (
          <p className="font-bold text-center uppercase">
            Vui lòng lưu ý rằng để thực hiện giao dịch rút tiền, số dư tài khoản
            của bạn cần phải đủ lớn, ít nhất là 50,000 VND. Hãy đảm bảo rằng bạn
            có số tiền đủ trước khi thực hiện yêu cầu rút tiền của mình. Xin cảm
            ơn!
          </p>
        ) : (
          <button
            className="btn btn-info font-bold uppercase text-white"
            onClick={() => setOpen(true)}
          >
            Rút tiền
          </button>
        )}
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${
              paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"
            } min-h-[40vh] p-3`}
          >
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="cursor-pointer"
              />
            </div>
            {paymentMethod ? (
              <div>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Thêm phương thức rút tiền:
                </h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Tên ngân hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      id=""
                      placeholder="Thêm tên ngân hàng!"
                      className="w-full border p-1 rounded-[5px] mt-2"
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Số tài khoản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name=""
                      id=""
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Thêm số tài khoản ngân hàng!"
                      className="w-full border p-1 rounded-[5px] mt-2"
                    />
                  </div>
                  <div className="pt-2">
                    <label>
                      Tên chủ thẻ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Thêm tên chủ tài khoản ngân hàng!"
                      className="w-full border p-1 rounded-[5px] mt-2"
                    />
                  </div>

                  <div className="pt-2">
                    <label>
                      Địa chỉ đăng ký ngân hàng{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      id=""
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Địa chỉ chi nhánh đăng ký thẻ ngân hàng!"
                      className="w-full border p-1 rounded-[5px] mt-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success font-bold uppercase text-white my-4"
                  >
                    Thêm
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-xl uppercase text-center">
                  Phương thức rút tiền
                </h3>

                {seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%]">
                        <h5>
                          Số tài khoản:{" "}
                          {"*".repeat(
                            seller?.withdrawMethod.bankAccountNumber.length - 3
                          ) +
                            seller?.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>
                          Tên ngân hàng: {seller?.withdrawMethod.bankName}
                        </h5>
                      </div>
                      <div className="800px:w-[50%]">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>
                      Số dư khả dụng:{" "}
                      {`${currency.format(availableBalance, { code: "VND" })}`}
                    </h4>
                    <br />
                    <span>Nhập số tiền cần rút:</span>
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="800px:w-[100px] w-[full] border 800px:mr-3 p-1 rounded"
                      />
                      <span className="mr-4">VND </span>
                      <div>
                        <button
                          className="btn btn-success font-bold uppercase text-white"
                          onClick={withdrawHandler}
                        >
                          Rút tiền
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-xl my-4">
                      Bạn chưa cập nhật phương thức rút tiền!
                    </p>
                    <div>
                      <button
                        className="btn btn-info font-bold uppercase text-white"
                        onClick={() => setPaymentMethod(true)}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#e60049",
  "#0bb4ff",
  "#50e991",
  "#e6d800",
  "#9b19f5",
  "#ffa300",
  "#dc0ab4",
  "#b3d4ff",
  "#00bfa0",
];

const Analytic = () => {
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [appMode, setAppMode] = useState(null);
  const [comparisonType, setComparisonType] = useState("");
  const [searchType, setSearchType] = useState("");
  // const [showMonthComparison, setShowMonthComparison] = useState(false);
  // const [showDayComparison, setShowDayComparison] = useState(false);

  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  console.log(products);

  const switchMode = (mode) => {
    if (appMode === mode) {
      // Nếu đã chọn rồi thì không làm gì cả
      return;
    }
    setTime1("");
    setTime2("");
    setData([]);
    setSearchType("");
    setComparisonType("");
    setAppMode(mode);
  };

  const handleOptionChange = (event) => {
    setTime1("");
    setTime2("");
    setData([]);
    setSearchType(event.target.value);
    setComparisonType(event.target.value);
  };

  // const handleOptionChange = (option) => {
  //   if (option === "month") {
  //     setShowMonthComparison(true);
  //     setShowDayComparison(false);
  //   } else if (option === "day") {
  //     setShowMonthComparison(false);
  //     setShowDayComparison(true);
  //   }
  // };

  const getDataDay = async () => {
    try {
      const response = await axios.get(
        `${server}/analytic/invoices-two-days?shopId=${seller._id}&time1=${time1}&time2=2024-01-01`,
        {
          withCredentials: true,
        }
      );
      // Xử lý response nếu cần
      setData(response.data);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error saving data:", error);
    }
  };

  const getDataMonth = async () => {
    try {
      const response = await axios.get(
        `${server}/analytic/invoices-two-months?shopId=${seller._id}&time1=${time1}&time2=2024-01-01`,
        {
          withCredentials: true,
        }
      );
      // Xử lý response nếu cần
      setData(response.data);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error saving data:", error);
    }
  };

  const getDataBetweenMonths = async () => {
    try {
      const response = await axios.get(
        `${server}/analytic/invoices-two-months?shopId=${seller._id}&time1=${time1}&time2=${time2}`,
        {
          withCredentials: true,
        }
      );
      // Xử lý response nếu cần
      setData(response.data);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error saving data:", error);
    }
  };

  const processDataForPurchasePieChart = (data) => {
    const totalValue1 = data.totalPurchaseValue1;
    const totalValue2 = data.totalPurchaseValue2;

    // Tạo một mảng dữ liệu phù hợp cho Pie Chart
    const pieChartData = [
      {
        name: "Tháng thứ nhất",
        value: totalValue1,
      },
      {
        name: "Tháng thứ hai",
        value: totalValue2,
      },
    ];

    return pieChartData;
  };

  const getPurchaseDataBetweenMonths = async () => {
    try {
      const response = await axios.get(
        `${server}/analytic/invoices-two-months?shopId=${seller._id}&time1=${time1}&time2=${time2}`,
        {
          withCredentials: true,
        }
      );
      // Xử lý response nếu cần
      const processedData = processDataForPurchasePieChart(response.data);
      setData(processedData);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error saving data:", error);
    }
  };

  const processDataForPieChart = (data) => {
    const totalValue1 = data.totalValue1;
    const totalValue2 = data.totalValue2;

    // Tạo một mảng dữ liệu phù hợp cho Pie Chart
    const pieChartData = [
      {
        name: "Ngày thứ nhất",
        value: totalValue1,
      },
      {
        name: "Ngày thứ hai",
        value: totalValue2,
      },
    ];

    return pieChartData;
  };

  const getDataBetweenDays = async () => {
    try {
      const response = await axios.get(
        `${server}/analytic/invoices-two-days?shopId=${seller._id}&time1=${time1}&time2=${time2}`,
        {
          withCredentials: true,
        }
      );

      // Xử lý dữ liệu và cập nhật trạng thái của component
      const processedData = processDataForPieChart(response.data);
      setData(processedData);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error saving data:", error);
    }
  };

  console.log(data)

  return (
    <div className="bg-white mx-4 w-full">
      <div className="flex w-full">
        <button
          className="btn btn-outline btn-info w-1/2 m-2 text-white font-bold "
          onClick={() => switchMode("search")}
        >
          Tìm kiếm
        </button>
        <button
          className="btn btn-outline btn-success w-1/2 m-2 text-white font-bold"
          onClick={() => switchMode("stats")}
        >
          Thống kê
        </button>
      </div>

      {appMode === "search" && (
        <>
          <div className="m-2">
            <select
              value={searchType}
              onChange={(value) => handleOptionChange(value)}
              className="select select-info w-full max-w-xs font-bold text-info"
            >
              <option selected>
                Pick your choice
              </option>

              <option value="day">Xem doanh thu của ngày cụ thể</option>
              <option value="month">Xem doanh thu của tháng cụ thể</option>
              <option value="soldProductMonth">
                Xem sản phẩm bán chạy của tháng
              </option>
              <option value="purchaseMonth">
                Xem số tiền nhập hàng của tháng cụ thể
              </option>
              <option value="purchasedProductMonth">
                Xem sản phẩm được nhập nhiều nhất của tháng
              </option>
            </select>
          </div>

          {searchType === "day" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Ngày:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2" className="invisible">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-info text-white font-bold"
                onClick={getDataDay}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          {searchType === "month" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Tháng:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2" className="invisible">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-info text-white font-bold"
                onClick={getDataMonth}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          {searchType === "soldProductMonth" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Tháng:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2" className="invisible">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-info text-white font-bold"
                onClick={getDataMonth}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          {searchType === "purchaseMonth" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Tháng:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2" className="invisible">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-info text-white font-bold"
                onClick={getDataMonth}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          {searchType === "purchasedProductMonth" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Tháng:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2" className="invisible">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-info text-white font-bold"
                onClick={getDataMonth}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          <div className="m-2">
            {searchType === "day" && data && data.totalValue1 && (
              <div className="text-info font-bold">
                Doanh thu của ngày {time1.slice(-2)} tháng {time1.slice(5, 7)}{" "}
                năm {time1.slice(0, 4)} là: {data.totalValue1}
              </div>
            )}
            {searchType === "month" &&
              // showMonthComparison &&
              data &&
              data.dailyRevenueData &&
              data.dailyRevenueData.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="font-bold text-xl text-info m-2 uppercase">
                    Doanh thu của tháng {time1.slice(5, 7)}
                  </div>
                  <LineChart
                    width={1000}
                    height={350}
                    data={data.dailyRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" name="Ngày" />
                    <YAxis name="Doanh thu" />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Line
                      type="monotone"
                      dataKey="time1"
                      stroke="#e60049"
                      name="Doanh thu"
                    />
                    {/* <Line
                  type="monotone"
                  dataKey="time2"
                  stroke="#0bb4ff"
                  name="Tháng thứ hai"
                /> */}
                  </LineChart>
                  <div>
                    <span className="font-bold text-info">
                      Trục X (Ngang): Ngày trong tháng
                    </span>
                    <ul className="list-disc">
                      <li>
                        <span className="font-bold">Đơn vị đo:</span> Ngày.
                      </li>
                      <li>
                        <span className="font-bold">Chú thích thêm:</span> Trục
                        X sẽ hiển thị thông tin về ngày trong tháng, giúp theo
                        dõi biến động của doanh thu theo thời gian.
                      </li>
                    </ul>
                    <span className="font-bold text-info">
                      Trục Y (Dọc): Doanh thu
                    </span>
                    <ul className="list-disc">
                      <li>
                        <span className="font-bold">Đơn vị đo:</span> VND.
                      </li>
                      <li>
                        <span className="font-bold">Chú thích thêm:</span> Trục
                        Y sẽ hiển thị thông tin về doanh thu đối với các ngày
                        trong tháng.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            {searchType === "soldProductMonth" &&
              data &&
              data.soldProductCount && (
                <div className="flex flex-col items-center">
                  <div className="font-bold text-info text-xl m-2 uppercase">
                    Số lượng sản phẩm đã bán được trong tháng{" "}
                    {time1.slice(5, 7)}
                  </div>
                  <PieChart width={730} height={450}>
                    <Pie
                      data={data.soldProductCount}
                      dataKey="quantity1"
                      nameKey={(entry) =>
                        products.find((p) => p._id === entry.product).name
                      }
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data &&
                        data.soldProductCount.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </div>
              )}
            {searchType === "purchaseMonth" &&
              // showMonthComparison &&
              data &&
              data.totalPurchaseValue1 && (
                <div className="text-info font-bold uppercase">
                  Số tiền nhập hàng của tháng {time1.slice(5, 7)} năm{" "}
                  {time1.slice(0, 4)} là: {data.totalPurchaseValue1}
                </div>
              )}
            {searchType === "purchasedProductMonth" &&
              data &&
              data.purchasedProductCount && (
                <div className="flex flex-col items-center">
                  <div className="font-bold text-info text-xl m-2 uppercase">
                    Số lượng sản phẩm đã được nhập trong tháng{" "}
                    {time1.slice(5, 7)}
                  </div>
                  <PieChart width={730} height={450}>
                    <Pie
                      data={data.purchasedProductCount}
                      dataKey="quantity1"
                      nameKey={(entry) =>
                        products.find((p) => p._id === entry.product).name
                      }
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data &&
                        data.purchasedProductCount.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </div>
              )}
          </div>
        </>
      )}

      {appMode === "stats" && (
        <>
          <div className="m-2">
            <select
              value={comparisonType}
              onChange={(value) => handleOptionChange(value)}
              className="select select-success w-full max-w-xs font-bold text-success"
            >
              <option selected>
                Pick your choice
              </option>
              <option value="dayComparison">
                So sánh doanh thu giữa 2 ngày
              </option>
              <option value="monthComparison">
                So sánh doanh thu giữa 2 tháng
              </option>
              <option value="purchaseMonthComparison">
                So sánh số tiền nhập hàng giữa 2 tháng
              </option>
            </select>
          </div>
          {comparisonType === "monthComparison" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Tháng thứ nhất:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-success text-white font-bold"
                onClick={getDataBetweenMonths}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          {/* {showDayComparison && ( */}
          {comparisonType === "dayComparison" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Ngày thứ nhất:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2">
                <span className="font-bold">Ngày thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-success text-white font-bold"
                onClick={getDataBetweenDays}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          {comparisonType === "purchaseMonthComparison" && (
            <div className="flex flex-col m-2">
              <label htmlFor="time1">
                <span className="font-bold">Tháng thứ nhất:</span>
                <input
                  type="date"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="border rounded p-2 ml-0.5 mb-4"
                />
              </label>
              <label htmlFor="time2">
                <span className="font-bold">Tháng thứ hai:</span>
                <input
                  type="date"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="border rounded p-2 ml-3 mb-4"
                />
              </label>
              <button
                className="btn btn-success text-white font-bold"
                onClick={getPurchaseDataBetweenMonths}
              >
                Gửi dữ liệu
              </button>
            </div>
          )}
          <div className="m-2">
            {comparisonType === "monthComparison" &&
              // showMonthComparison &&
              data &&
              data.dailyRevenueData &&
              data.dailyRevenueData.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="font-bold text-success text-xl m-2 uppercase">
                    So sánh doanh thu giữa 2 tháng
                  </div>
                  <LineChart
                    // width={730}
                    width={1000}
                    height={350}
                    data={data.dailyRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="time1"
                      stroke="#e60049"
                      name="Tháng thứ nhất"
                    />
                    <Line
                      type="monotone"
                      dataKey="time2"
                      stroke="#0bb4ff"
                      name="Tháng thứ hai"
                    />
                  </LineChart>
                  <div>
                    <p className="font-bold">
                      <span className="text-[#e60049]">Tháng thứ nhất: </span>
                      Tháng {time1.slice(5, 7)} năm {time1.slice(0, 4)}
                    </p>
                    <p className="font-bold">
                      <span className="text-[#0bb4ff]">Tháng thứ hai: </span>
                      Tháng {time2.slice(5, 7)} năm {time2.slice(0, 4)}
                    </p>
                    <span className="font-bold text-success">
                      Trục X (Ngang): Ngày trong tháng
                    </span>
                    <ul className="list-disc">
                      <li>
                        <span className="font-bold">Đơn vị đo:</span> Ngày.
                      </li>
                      <li>
                        <span className="font-bold">Chú thích thêm:</span> Trục
                        X sẽ hiển thị thông tin về ngày trong tháng, giúp theo
                        dõi biến động của doanh thu theo thời gian.
                      </li>
                    </ul>
                    <span className="font-bold text-success">
                      Trục Y (Dọc): Doanh thu
                    </span>
                    <ul className="list-disc">
                      <li>
                        <span className="font-bold">Đơn vị đo:</span> VND.
                      </li>
                      <li>
                        <span className="font-bold">Chú thích thêm:</span> Trục
                        Y sẽ hiển thị thông tin về doanh thu đối với các ngày
                        trong tháng.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

            {comparisonType === "dayComparison" && data && data.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="font-bold text-success text-xl m-2 uppercase">
                  So sánh doanh thu giữa 2 ngày
                </div>
                <PieChart width={730} height={250}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data &&
                      data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Legend />
                </PieChart>
                <div className="font-bold">
                  <p>
                    <span className="text-[#e60049]">Ngày thứ nhất: </span>
                    Ngày {time1.slice(-2)} tháng {time1.slice(5, 7)} năm{" "}
                    {time1.slice(0, 4)}
                  </p>
                  <p>
                    <span className="text-[#0bb4ff]">Ngày thứ hai: </span>
                    Ngày {time2.slice(-2)} tháng {time2.slice(5, 7)} năm{" "}
                    {time2.slice(0, 4)}
                  </p>
                </div>
              </div>
            )}
            {comparisonType === "purchaseMonthComparison" &&
              // showMonthComparison &&
              data &&
              data.length > 0 && (
                <div className="flex flex-col items-center">
                  <div className="font-bold text-success text-xl m-2 uppercase">
                    So sánh số tiền nhập hàng giữa 2 tháng
                  </div>
                  <PieChart width={730} height={250}>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data &&
                        data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                  <div className="font-bold">
                    <p>
                      <span className="text-[#e60049]">Tháng thứ nhất: </span>
                      Tháng {time1.slice(5, 7)} năm {time1.slice(0, 4)}
                    </p>
                    <p>
                      <span className="text-[#0bb4ff]">Tháng thứ hai: </span>
                      Tháng {time2.slice(5, 7)} năm {time2.slice(0, 4)}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytic;

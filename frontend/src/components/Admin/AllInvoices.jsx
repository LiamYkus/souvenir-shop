import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSellers } from "../../redux/actions/sellers";
import Loader from "../Layout/Loader";
import { server } from "../../server";

const AllInvoices = () => {
  const [data, setData] = useState([]);
  const [selectedShop, setSelectedShop] = useState();
  const { sellers, isLoading } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  useEffect(() => {
    axios
      .get(`${server}/invoice/admin-all-invoices`, { withCredentials: true })
      .then((res) => {
        setData(res.data.invoices);
      });
  }, []);

  const handleChange = (e) => {
    setSelectedShop(e.target.value);
  };
  const invoices = data.filter((i) => i.shop._id === selectedShop);

  const columns = [
    { field: "id", hide: true },
    { field: "date", headerName: "Ngày nhập", flex: 1 },
    {
      field: "invoiceNumber",
      headerName: "Số hóa đơn",
      flex: 1,
    },
    { field: "type", headerName: "Loại hóa đơn", flex: 1 },
    {
      field: "view",
      headerName: "Xem",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Link to={`/admin-invoice/${params.row.id}`}>
          <Button>
            <AiOutlineEye />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = invoices
    ? invoices.map((item) => ({
        id: item._id,
        invoiceNumber: item.invoiceNumber,
        date: item.date.slice(0, 10),
        type: item.type,
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full bg-white m-4">
          <div className="text-xl font-bold uppercase">Tất cả hóa đơn</div>
          <select
            value={selectedShop}
            onChange={handleChange}
            className="select select-bordered w-full my-2"
          >
            <option value="">Chọn một shop</option>
            {sellers &&
              sellers.map((seller) => (
                <option key={seller._id} value={seller._id}>
                  {seller.name}
                </option>
              ))}
          </select>
          {rows.length > 0 && (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />
          )}
        </div>
      )}
    </>
  );
};

export default AllInvoices;

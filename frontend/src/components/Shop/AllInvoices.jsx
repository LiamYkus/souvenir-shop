import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllInvoicesShop } from "../../redux/actions/invoice";
import Loader from "../Layout/Loader";

const AllInvoices = () => {
  const { invoices, isLoading } = useSelector((state) => state.invoices);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllInvoicesShop(seller._id));
  }, [dispatch]);

  console.log(invoices);

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
        <Link to={`/invoice/${params.row.id}`}>
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
        <div className="w-full mx-4 bg-white">
          <div className="my-4 text-xl font-bold uppercase">Tất cả hóa đơn</div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllInvoices;

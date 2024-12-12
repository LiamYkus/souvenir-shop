import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { getInvoiceDetail } from "../../redux/actions/invoice";
import { getAllProducts } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { backend_url } from "../../server";
const InvoiceDetail = () => {
  const { id } = useParams();
  const { invoice, isLoading } = useSelector((state) => state.invoices);
  const { allProducts } = useSelector((state) => state.products);
  const { allSuppliers } = useSelector((state) => state.suppliers);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInvoiceDetail(id));
    dispatch(getAllProducts());
  }, [dispatch]);

  const totalAmount =
    invoice &&
    invoice.products.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);

  const supplier =
    invoice &&
    allSuppliers.find((supplier) => supplier.name === invoice.supplier);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <section ref={componentRef}>
            <div className="w-full bg-white p-4">
              <div className="flex flex-col justify-between text-center">
                <div>
                  <h1 className="text-3xl italic font-bold tracking-widest">
                    {invoice?.type === "Sale" && invoice?.shop.name}
                    {invoice?.type === "Purchase" && supplier?.name}
                    {invoice?.type === "Refund" && invoice?.shop.name}
                  </h1>
                </div>
                <div className="text-sm">
                  {invoice?.type === "Sale" &&
                    `Địa chỉ: ${invoice?.shop?.address}`}
                  {invoice?.type === "Purchase" &&
                    `Địa chỉ: ${supplier?.address}, Email: ${supplier?.email}, Số điện thoại: ${supplier?.phoneNumber}`}
                  {invoice?.type === "Refund" &&
                    `Địa chỉ: ${invoice?.shop?.address}`}
                </div>
              </div>
              <div className="w-full h-0.5 bg-indigo-500"></div>
              <div className="flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">
                      Số:{" "}
                      <span className="text-sm font-medium">
                        {invoice?.invoiceNumber}
                      </span>
                    </div>
                    <div className="font-bold">
                      Thời gian:{" "}
                      <span className="text-sm font-medium">
                        {" "}
                        {invoice?.date &&
                          `Ngày ${invoice?.date.slice(
                            8,
                            10
                          )} Tháng ${invoice?.date.slice(
                            5,
                            7
                          )} Năm ${invoice?.date.slice(0, 4)}`}
                      </span>
                    </div>
                    {invoice?.type === "Sale" && (
                      <>
                        <div className="text-sm">
                          <span className="font-bold">Khách hàng: </span>
                          {invoice?.customer?.name}
                        </div>
                        <div className="text-sm">
                          <span className="font-bold">Email: </span>
                          {invoice?.customer?.email}
                        </div>
                      </>
                    )}
                    {invoice?.type === "Purchase" && (
                      <>
                        <div className="text-sm">
                          <span className="font-bold">Khách hàng: </span>
                          {invoice?.shop?.name}
                        </div>
                        <div className="text-sm">
                          <span className="font-bold">Email: </span>
                          {invoice?.shop?.email}
                        </div>
                        <div className="text-sm">
                          <span className="font-bold">Địa chỉ: </span>
                          {invoice?.shop?.address}
                        </div>
                      </>
                    )}
                    {invoice?.type === "Refund" && (
                      <>
                        <div className="text-sm">
                          <span className="font-bold">Khách hàng: </span>
                          {invoice?.customer?.name}
                        </div>
                        <div className="text-sm">
                          <span className="font-bold">Email: </span>
                          {invoice?.customer?.email}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    {invoice?.type === "Sale" && (
                      <img
                        src={`${backend_url}${invoice?.shop?.avatar}`}
                        className="h-40 w-40 object-cover rounded"
                      />
                    )}
                    {invoice?.type === "Purchase" && (
                      <img
                        src={`${backend_url}${supplier?.image}`}
                        className="h-40 w-40 object-cover rounded"
                      />
                    )}
                    {invoice?.type === "Refund" && (
                      <img
                        src={`${backend_url}${invoice?.shop?.avatar}`}
                        className="h-40 w-40 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                      <th>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.products.map((p, index) => (
                      <tr key={p._id}>
                        <td>{index + 1}</td>
                        <td>
                          {
                            allProducts.find(
                              (product) => product._id === p.product
                            )?.name
                          }
                        </td>
                        <td>{p.quantity}</td>
                        <td>{p.price}</td>
                        <td>{p.quantity * p.price}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} />
                      <td>Tổng</td>
                      <td>{totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex text-center m-4">
                <div className="w-1/2">
                  <h3>Khách hàng</h3>
                  <div className="italic">
                    {invoice?.type === "Sale" && invoice?.customer?.name}
                    {invoice?.type === "Purchase" && invoice?.shop?.name}
                    {invoice?.type === "Refund" && invoice?.customer?.name}
                  </div>
                </div>
                <div className="w-1/2">
                  <h3>Người bán hàng</h3>
                  <div>
                    {invoice?.type === "Sale" && invoice?.shop?.name}
                    {invoice?.type === "Purchase" && invoice?.supplier}
                    {invoice?.type === "Refund" && invoice?.shop?.name}
                  </div>
                </div>
              </div>
              <div className="w-full h-0.5 bg-indigo-500"></div>

              <div className="p-4">
                <div className="flex items-center justify-center">
                  Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!
                </div>
                <div className="flex items-end justify-end space-x-3">
                  <button
                    onClick={handlePrint}
                    className="btn btn-accent text-white"
                  >
                    In
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default InvoiceDetail;

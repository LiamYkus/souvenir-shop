import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createPurchaseInvoice } from "../../redux/actions/invoice";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { suppliersData } from "../../static/data";
import { server } from "../../server";

const CreatePurchaseInvoice = () => {
  const [date, setDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [selectedItemsData, setSelectedItemsData] = useState([
    { id: 1, product: "", quantity: "", price: "" },
  ]);
  const [selectedItem, setSelectedItem] = useState();

  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { allSuppliers } = useSelector((state) => state.suppliers);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formatDateToISOString = (inputDate) => {
    const inputDateObj = new Date(inputDate);
    if (!isNaN(inputDateObj.getTime())) {
      const isoString = inputDateObj.toISOString();
      return isoString;
    } else {
      return null;
    }
  };

  const getNextInvoiceNumber = async () => {
    try {
      const response = await axios.get(
        `${server}/invoice/get-next-invoice-number/${seller._id}`,
        { withCredentials: true }
      );
      if (response.data && response.data.nextInvoiceNumber) {
        setInvoiceNumber(response.data.nextInvoiceNumber); // Cập nhật state với số hóa đơn mới nhất
      }
    } catch (error) {
      console.error("Lỗi khi lấy số hóa đơn từ API:", error);
    }
  };

  useEffect(() => {
    getNextInvoiceNumber();
  }, []);

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id)); // Thay seller._id bằng ID cần truy vấn
  }, [dispatch, seller._id]);

  useEffect(() => {
    setIsDeleteButtonVisible(selectedItemsData.length > 1);
  }, [selectedItemsData]);

  // console.log(products);

  const handleAddRow = () => {
    if (
      selectedItemsData[selectedItemsData.length - 1].price <
      originalPriceSeletedItem
    ) {
      const newId = selectedItemsData[selectedItemsData.length - 1].id + 1;
      setSelectedItemsData([
        ...selectedItemsData,
        { id: newId, product: "", quantity: "", price: "" },
      ]);
    } else {
      toast.error("Giá nhập phải nhỏ hơn giá bán.");
    }
  };

  const handleDeleteRow = (id) => {
    const updatedProducts = selectedItemsData.filter(
      (product) => product.id !== id
    );
    setSelectedItemsData(updatedProducts);
    setRowsToDelete([...rowsToDelete, id]);
  };

  const handleInputChange = (id, field, value) => {
    const updatedProducts = selectedItemsData.map((product) => {
      if (product.id === id) {
        return { ...product, [field]: value };
      }
      return product;
    });
    setSelectedItemsData(updatedProducts);
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  const handleInvoiceNumberChange = (value) => {
    setInvoiceNumber(value);
  };

  const handleSupplierChange = (value) => {
    setSupplier(value);
  };

  const originalPriceSeletedItem =
    products &&
    products?.find((product) => product._id === selectedItem)?.price;

  const checkPrice = (item) => {
    const product = products.find((product) => product._id === item.product);
    const priceBetweenInAndSell = item.price - product.price;
    if (priceBetweenInAndSell < 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleSave = () => {
    if (
      date &&
      invoiceNumber &&
      supplier &&
      selectedItemsData.every(
        (item) =>
          item.product && item.quantity > 0 && item.price && checkPrice(item)
      )
    ) {
      const isoDate = formatDateToISOString(date);

      const dataToSend = {
        type: "Purchase",
        invoiceNumber,
        shopId: seller._id,
        date: isoDate,
        supplier,
        selectedItemsData,
      };
      dispatch(createPurchaseInvoice(dataToSend));
      toast.success("Hóa đơn đã được tạo thành công");
      navigate("/dashboard-invoices");
      window.location.reload();
    } else {
      toast.error(
        "Vui lòng điền đầy đủ thông tin hoặc kiểm tra giữa giá nhập và giá bán"
      );
    }
  };

  const availableProducts =
    products && products.filter((p) => p.isActive === true);

  return (
    <div className="container mx-4">
      <div className="my-4 text-xl font-bold uppercase">Thêm phiếu nhập</div>
      <div className="mb-4">
        <label className="text-lg">Ngày nhập:</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="text-lg">Số hóa đơn:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={invoiceNumber}
          onChange={(e) => handleInvoiceNumberChange(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="text-lg">Nhà cung cấp:</label>
        <select
          className="w-full p-2 border rounded"
          value={supplier}
          onChange={(e) => handleSupplierChange(e.target.value)}
        >
          <option value="">-- Chọn một mục --</option>
          {allSuppliers &&
            allSuppliers?.map((supplier) => (
              <option key={supplier.id} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4 text-lg text-error">
        Giá gốc hiện tại của sản phẩm là: {originalPriceSeletedItem}
      </div>
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="p-2">STT</th>
            <th className="p-2">Tên sản phẩm</th>
            <th className="p-2">Số lượng</th>
            <th className="p-2">Giá</th>
          </tr>
        </thead>
        <tbody>
          {selectedItemsData.map((product) => (
            <tr key={product.id}>
              <td className="p-2">{product.id}</td>
              <td className="p-2">
                <select
                  value={product.name}
                  onChange={(e) =>
                    handleInputChange(product.id, "product", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  onClick={() => setSelectedItem(product.product)}
                >
                  <option value="">Chọn sản phẩm</option>
                  {/* {products &&
                    products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))} */}
                  {availableProducts &&
                    availableProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={product.quantity}
                  onChange={(e) =>
                    handleInputChange(product.id, "quantity", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={product.price}
                  onChange={(e) =>
                    handleInputChange(product.id, "price", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button
          onClick={handleAddRow}
          className="btn btn-info mb-4 text-white font-bold uppercase"
        >
          Thêm dòng
        </button>
      </div>
      <div className="text-center">
        {isDeleteButtonVisible && (
          <button
            onClick={() =>
              handleDeleteRow(
                selectedItemsData[selectedItemsData.length - 1].id
              )
            }
            className="btn btn-error mb-4 text-white font-bold uppercase"
          >
            Xóa dòng
          </button>
        )}
      </div>
      <div className="text-right">
        <button
          onClick={handleSave}
          className="btn btn-success mb-4 text-white font-bold uppercase"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default CreatePurchaseInvoice;

const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();
const Invoice = require("../model/invoice");
const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");

// Tạo hóa đơn mới (bao gồm cả nhập và bán)
router.post("/create-purchase-invoice", isSeller, async (req, res) => {
  try {
    const { type, invoiceNumber, selectedItemsData, shopId, date, supplier } =
      req.body; // Dữ liệu được gửi từ phía client

    // Tìm thông tin cửa hàng dựa trên shopId
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    const combinedInvoices = [];
    for (const productData of selectedItemsData) {
      const { product, quantity, price } = productData;
      const existingInvoice = combinedInvoices.find(
        (invoice) =>
          invoice.type === type &&
          invoice.invoiceNumber.toString() === invoiceNumber.toString() &&
          invoice.shop.toString() === shopId.toString() &&
          invoice.date.toString() === date.toString() &&
          invoice.supplier.toString() === supplier.toString()
      );

      if (existingInvoice) {
        existingInvoice.products.push({ product, quantity, price });
      } else {
        combinedInvoices.push({
          type,
          invoiceNumber,
          shop: shopId,
          date,
          supplier,
          products: [{ product, quantity, price }],
        });
      }
    }

    const createdInvoices = await Invoice.insertMany(combinedInvoices);
    for (const createdInvoice of createdInvoices) {
      for (const productData of createdInvoice.products) {
        const { product, quantity, price } = productData;
        const productDoc = await Product.findById(product);
        if (
          productDoc &&
          typeof productDoc.stock !== "undefined" &&
          typeof quantity !== "undefined"
        ) {
          if (type === "Purchase") {
            await Product.findByIdAndUpdate(
              productDoc._id,
              { $inc: { stock: quantity } },
              { new: true }
            );
          }
          await Product.findByIdAndUpdate(productDoc._id, {
            $push: {
              invoices: { invoice: createdInvoice._id, quantity, price },
            },
          });
        }
      }
    }

    res.status(200).json({
      message: `${type} invoice successful`,
      invoice: createdInvoices,
    });
  } catch (error) {}
});

// Lấy tất cả hóa đơn của cửa hàng với ID tương ứng
router.get("/get-all-invoices-shop/:id", isSeller, async (req, res) => {
  try {
    const shopId = req.params.id;

    // Kiểm tra xem cửa hàng có tồn tại không
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Tìm tất cả các hóa đơn của cửa hàng với ID tương ứng
    const invoices = await Invoice.find({ shop: shopId }).populate(
      "customer shop"
    );

    res.status(200).json(invoices);
  } catch (error) {}
});

router.get(
  "/admin-all-invoices",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const invoices = await Invoice.find({}).populate("customer shop");
      res.status(200).json({ invoices });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

router.get("/get-invoice/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findOne({ _id: id }).populate("customer shop");
    res.status(200).json({ invoice });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Lấy số hóa đơn lớn nhất + 1 cho cửa hàng cụ thể
router.get("/get-next-invoice-number/:shopId", isSeller, async (req, res) => {
  try {
    const shopId = req.params.shopId;

    // Tìm thông tin cửa hàng dựa trên shopId
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Tìm hóa đơn có số lớn nhất dựa trên shopId
    const lastInvoice = await Invoice.findOne({ shop: shopId })
      .sort({ invoiceNumber: -1 })
      .limit(1);

    let nextInvoiceNumber = "00000001"; // Mặc định, nếu không có hóa đơn nào.

    if (lastInvoice && !isNaN(lastInvoice.invoiceNumber)) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber, 10) + 1;
      nextInvoiceNumber = lastNumber.toString().padStart(8, "0");
    }

    res.status(200).json({ nextInvoiceNumber });
  } catch (error) {}
});

// Cập nhật thông tin hóa đơn
router.put("/invoices/:id", async (req, res) => {
  // Xử lý cập nhật hóa đơn ở đây
});

// Xóa hóa đơn
router.delete("/invoices/:id", async (req, res) => {
  // Xử lý xóa hóa đơn ở đây
});

module.exports = router;

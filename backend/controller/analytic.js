const express = require("express");
const router = express.Router();
const Invoice = require("../model/invoice");
const Shop = require("../model/shop");

// Hàm tính tổng totalValue của danh sách hóa đơn
const calculateTotalValue = (invoices) => {
  return invoices.map((invoice) => {
    const totalValue = invoice.products.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);
    return {
      ...invoice.toObject(),
      totalValue,
    };
  });
};

// API endpoint để lấy dữ liệu hóa đơn của 2 tháng
router.get("/invoices-two-months", async (req, res) => {
  try {
    const time1 = new Date(req.query.time1);
    const time2 = new Date(req.query.time2);
    const shopId = req.query.shopId;

    const startDate1 = new Date(time1.getFullYear(), time1.getMonth(), 1);
    const endDate1 = new Date(time1.getFullYear(), time1.getMonth() + 1, 1);
    const startDate2 = new Date(time2.getFullYear(), time2.getMonth(), 1);
    const endDate2 = new Date(time2.getFullYear(), time2.getMonth() + 1, 1);

    // Tìm cửa hàng dựa trên shopId
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Cửa hàng không tồn tại." });
    }

    const soldProduct = {};

    const purchasedProduct = {};

    const invoices1 = await Invoice.find({
      type: "Sale",
      date: { $gte: startDate1, $lte: endDate1 },
      shop: shopId, // Lọc hóa đơn theo shopId
    });

    const invoices2 = await Invoice.find({
      type: "Sale",
      date: { $gte: startDate2, $lte: endDate2 },
      shop: shopId, // Lọc hóa đơn theo shopId
    });

    const purchaseInvoices1 = await Invoice.find({
      type: "Purchase",
      date: { $gte: startDate1, $lte: endDate1 },
      shop: shopId, // Lọc hóa đơn theo shopId
    });

    const purchaseInvoices2 = await Invoice.find({
      type: "Purchase",
      date: { $gte: startDate2, $lte: endDate2 },
      shop: shopId, // Lọc hóa đơn theo shopId
    });

    // Vòng lặp qua danh sách invoices tháng 1
    invoices1.forEach((invoice) => {
      invoice.products.forEach((product) => {
        // Kiểm tra xem sản phẩm đã tồn tại trong object soldProduct chưa
        if (soldProduct[product.product._id]) {
          // Nếu rồi thì cộng dồn số lượng
          soldProduct[product.product._id].quantity1 += product.quantity;
        } else {
          // Nếu chưa thì khởi tạo object với số lượng ban đầu
          soldProduct[product.product._id] = {
            product: product.product._id,
            quantity1: product.quantity,
            quantity2: 0,
          };
        }
      });
    });

    // Tương tự với danh sách invoices tháng 2
    invoices2.forEach((invoice) => {
      invoice.products.forEach((product) => {
        if (soldProduct[product.product._id]) {
          soldProduct[product.product._id].quantity2 += product.quantity;
        } else {
          soldProduct[product.product._id] = {
            product: product.product._id,
            quantity1: 0,
            quantity2: product.quantity,
          };
        }
      });
    });

    // Cuối cùng chuyển object soldProduct sang array để trả về
    const soldProductCount = Object.values(soldProduct);

    // Vòng lặp qua danh sách invoices tháng 1
    purchaseInvoices1.forEach((invoice) => {
      invoice.products.forEach((product) => {
        // Kiểm tra xem sản phẩm đã tồn tại trong object purchasedProduct chưa
        if (purchasedProduct[product.product._id]) {
          // Nếu rồi thì cộng dồn số lượng
          purchasedProduct[product.product._id].quantity1 += product.quantity;
        } else {
          // Nếu chưa thì khởi tạo object với số lượng ban đầu
          purchasedProduct[product.product._id] = {
            product: product.product._id,
            quantity1: product.quantity,
            quantity2: 0,
          };
        }
      });
    });

    // Tương tự với danh sách invoices tháng 2
    purchaseInvoices2.forEach((invoice) => {
      invoice.products.forEach((product) => {
        if (purchasedProduct[product.product._id]) {
          purchasedProduct[product.product._id].quantity2 += product.quantity;
        } else {
          purchasedProduct[product.product._id] = {
            product: product.product._id,
            quantity1: 0,
            quantity2: product.quantity,
          };
        }
      });
    });

    const purchasedProductCount = Object.values(purchasedProduct);

    const invoicesWithTotalValue1 = calculateTotalValue(invoices1);
    const invoicesWithTotalValue2 = calculateTotalValue(invoices2);

    const purchaseInvoicesWithTotalValue1 =
      calculateTotalValue(purchaseInvoices1);
    const purchaseInvoicesWithTotalValue2 =
      calculateTotalValue(purchaseInvoices2);

    const totalValue1 = invoicesWithTotalValue1.reduce((total, invoice) => {
      return total + invoice.totalValue;
    }, 0);

    const totalValue2 = invoicesWithTotalValue2.reduce((total, invoice) => {
      return total + invoice.totalValue;
    }, 0);

    const totalPurchaseValue1 = purchaseInvoicesWithTotalValue1.reduce(
      (total, invoice) => {
        return total + invoice.totalValue;
      },
      0
    );

    const totalPurchaseValue2 = purchaseInvoicesWithTotalValue2.reduce(
      (total, invoice) => {
        return total + invoice.totalValue;
      },
      0
    );

    // Tính toán số ngày trong tháng dựa trên thời gian đầu vào
    const daysInMonth1 = new Date(
      time1.getFullYear(),
      time1.getMonth() + 1,
      0
    ).getDate();
    const daysInMonth2 = new Date(
      time2.getFullYear(),
      time2.getMonth() + 1,
      0
    ).getDate();

    // Tạo mảng chứa doanh thu từng ngày
    const dailyRevenueData = [];
    for (let i = 1; i <= 31; i++) {
      // Tính doanh thu từng ngày cho time1 và time2
      const revenueDay1 = invoicesWithTotalValue1.reduce((total, invoice) => {
        const invoiceDate = new Date(invoice.date).getDate();
        return invoiceDate === i ? total + invoice.totalValue : total;
      }, 0);

      const revenueDay2 = invoicesWithTotalValue2.reduce((total, invoice) => {
        const invoiceDate = new Date(invoice.date).getDate();
        return invoiceDate === i ? total + invoice.totalValue : total;
      }, 0);

      // Đẩy dữ liệu vào mảng dailyRevenueData
      dailyRevenueData.push({
        name: i,
        time1: revenueDay1,
        time2: revenueDay2,
      });
    }

    res.json({
      invoices1: invoicesWithTotalValue1,
      invoices2: invoicesWithTotalValue2,
      totalValue1,
      totalValue2,
      totalPurchaseValue1,
      totalPurchaseValue2,
      dailyRevenueData, // Thêm dữ liệu doanh thu từng ngày
      soldProductCount,
      purchasedProductCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server." });
  }
});

// API endpoint để lấy dữ liệu hóa đơn của 2 ngày
router.get("/invoices-two-days", async (req, res) => {
  try {
    const time1 = new Date(req.query.time1);
    const time2 = new Date(req.query.time2);

    const startDate1 = new Date(
      time1.getFullYear(),
      time1.getMonth(),
      time1.getDate()
    );
    const endDate1 = new Date(
      time1.getFullYear(),
      time1.getMonth(),
      time1.getDate() + 1
    );
    const startDate2 = new Date(
      time2.getFullYear(),
      time2.getMonth(),
      time2.getDate()
    );
    const endDate2 = new Date(
      time2.getFullYear(),
      time2.getMonth(),
      time2.getDate() + 1
    );

    const invoices1 = await Invoice.find({
      type: "Sale",
      date: { $gte: startDate1, $lte: endDate1 },
    });

    const invoices2 = await Invoice.find({
      type: "Sale",
      date: { $gte: startDate2, $lte: endDate2 },
    });

    const invoicesWithTotalValue1 = calculateTotalValue(invoices1);
    const invoicesWithTotalValue2 = calculateTotalValue(invoices2);

    const totalValue1 = invoicesWithTotalValue1.reduce((total, invoice) => {
      return total + invoice.totalValue;
    }, 0);

    const totalValue2 = invoicesWithTotalValue2.reduce((total, invoice) => {
      return total + invoice.totalValue;
    }, 0);

    res.json({
      invoices1: invoicesWithTotalValue1,
      invoices2: invoicesWithTotalValue2,
      totalValue1,
      totalValue2,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server." });
  }
});

module.exports = router;

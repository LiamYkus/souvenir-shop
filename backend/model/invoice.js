const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Purchase", "Sale", "Refund"],
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  supplier: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến mô hình User
  },
});

invoiceSchema.pre("save", function (next) {
  if (this.type !== "Purchase") {
    this.supplier = undefined;
  }
  next();
});

// Thêm một hàm middleware để kiểm tra và đảm bảo rằng trường "customer" chỉ có giá trị khi "type" là "Sale".
invoiceSchema.pre("save", function (next) {
  if (this.type !== "Sale") {
    this.customer = undefined;
  }
  next();
});

// Thêm một middleware để tạo số hóa đơn nếu nó không tồn tại
invoiceSchema.pre("save", async function (next) {
  // Nếu invoiceNumber không được gửi lên từ client hoặc là chuỗi rỗng
  if (!this.invoiceNumber || this.invoiceNumber.trim() === "") {
    // Tìm hóa đơn có số lớn nhất trong cơ sở dữ liệu
    const lastInvoice = await this.constructor
      .findOne({})
      .sort({ invoiceNumber: -1 })
      .limit(1);

    if (!lastInvoice) {
      // Nếu không có hóa đơn nào trong cơ sở dữ liệu, bắt đầu từ số 00000001
      this.invoiceNumber = "00000001";
    } else {
      // Nếu có hóa đơn trong cơ sở dữ liệu, tăng số lên 1 đơn vị
      const lastNumber = parseInt(lastInvoice.invoiceNumber, 10);
      if (lastNumber < 99999999) {
        this.invoiceNumber = (lastNumber + 1).toString().padStart(8, "0");
      } else {
        // Đã đạt đến giới hạn tối đa
        // Có thể xử lý hoặc thông báo lỗi tùy theo yêu cầu
        console.error("Đã đạt đến giới hạn tối đa cho số hóa đơn.");
      }
    }
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);

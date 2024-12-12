const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const CryptoJS = require("crypto-js");

// create shop
// router.post("/create-shop", upload.single("file"), async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const sellerEmail = await Shop.findOne({ email });
//     if (sellerEmail) {
//       const filename = req.file.filename;
//       const filePath = `uploads/${filename}`;
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.log(err);
//           res.status(500).json({ message: "Error deleting file" });
//         }
//       });
//       return next(new ErrorHandler("Email đã được sử dụng!", 400));
//     }
//
//     const filename = req.file.filename;
//     const fileUrl = path.join(filename);
//
//     const seller = {
//       name: req.body.name,
//       email: email,
//       password: req.body.password,
//       avatar: fileUrl,
//       address: req.body.address,
//       phoneNumber: req.body.phoneNumber,
//     };
//
//     const activationToken = createActivationToken(seller);
//
//     const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;
//
//     try {
//       await sendMail({
//         email: seller.email,
//         subject: "Activate your Shop",
//         message: `Xin chào ${seller.name}, Vui lòng nhấn vào liên kết để xác minh email đăng ký " Trở thành người bán" trên CTU Souvenir Shop: ${activationUrl}`,
//       });
//       res.status(201).json({
//         success: true,
//         message: `Vui lòng kiểm tra Email:- ${seller.email} để xác minh đăng ký!`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password, address, phoneNumber } = req.body;

        // Kiểm tra xem email đã được sử dụng chưa
        const existingShop = await Shop.findOne({ email });
        if (existingShop) {
            // Xóa tệp avatar đã tải lên nếu email đã được sử dụng
            if (req.file) {
                const filePath = path.join(__dirname, "../uploads", req.file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Lỗi khi xóa tệp:", err);
                    }
                });
            }
            return next(new ErrorHandler("Email đã được sử dụng!", 400));
        }

        // Lưu đường dẫn tệp avatar
        const avatar = req.file ? req.file.filename : "";

        // Tạo đối tượng cửa hàng mới
        const newShop = new Shop({
            name,
            email,
            password,
            avatar,
            address,
            phoneNumber,
        });

        // Lưu cửa hàng vào cơ sở dữ liệu
        await newShop.save();

        res.status(201).json({
            success: true,
            message: "Cửa hàng đã được tạo thành công!",
            shop: newShop,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Token không hợp lệ", 400));
      }
      const { name, email, password, avatar, address, phoneNumber } = newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("Email này đã được sử dụng!", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
        console.log('tong tin', req.body)
      if (!email || !password) {
        return next(
          new ErrorHandler("Vui lòng điền đầy đủ thông tin đăng nhập!", 400)
        );
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Cửa hàng này không tồn tại!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Cửa hàng này không tồn tại!", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Đăng xuất thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await Shop.findById(req.seller._id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Cửa hàng này không tìm thấy", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      // shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(new ErrorHandler("Người bán không có sẵn với id này", 400));
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Đã xóa cửa hàng này thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(
          new ErrorHandler("Không tìm thấy cừa hàng với id này", 400)
        );
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;
    const shop = await Shop.findOne({ email });
    if (!shop) {
      return next(new ErrorHandler("Người dùng không tồn tại!", 404));
    }

    // Tạo token để đặt lại mật khẩu
    const resetToken = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const resetPasswordToken = CryptoJS.SHA256(resetToken).toString();

    // Thời gian hết hạn của token (ví dụ: 30 phút)
    const resetPasswordTime = Date.now() + 30 * 60 * 1000;

    // Lưu thông tin token vào database
    shop.resetPasswordToken = resetPasswordToken;
    shop.resetPasswordTime = resetPasswordTime;
    await shop.save();

    // Gửi email chứa liên kết đặt lại mật khẩu
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendMail({
      email: shop.email,
      subject: "Reset Your Password",
      message: `Đến link này để reset lại mật khẩu của bạn: ${resetUrl}`,
    });

    res.status(200).json({
      success: true,
      message:
        "Đã gửi email để đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến của bạn!",
    });
  })
);

// ... các đoạn code khác

// Đặt lại mật khẩu
router.post(
  "/reset-password/:resetToken",
  catchAsyncErrors(async (req, res, next) => {
    const resetToken = req.params.resetToken;

    // Tìm người dùng với token trong database
    const shop = await Shop.findOne({
      resetPasswordToken: CryptoJS.SHA256(resetToken).toString(),
      resetPasswordTime: { $gt: Date.now() },
    });

    if (!shop) {
      return next(new ErrorHandler("Token không hợp lệ hoặc đã hết hạn!", 400));
    }

    // Thiết lập mật khẩu mới
    shop.password = req.body.newPassword;
    shop.resetPasswordToken = undefined;
    shop.resetPasswordTime = undefined;
    await shop.save();

    // Gửi lại token và thông tin đăng nhập
    sendShopToken(shop, 201, res);
  })
);

module.exports = router;

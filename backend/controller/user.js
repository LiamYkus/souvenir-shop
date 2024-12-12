const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const CryptoJS = require("crypto-js");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("Người dùng đã tồn tại", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // try {
    //   await sendMail({
    //     email: user.email,
    //     subject: "Activate your account",
    //     message: `Xin chào ${user.name}, vui lòng nhấn vào liên kết để kích hoạt tài khoản: ${activationUrl}`,
    //   });
    //   res.status(201).json({
    //     success: true,
    //     message: `Vui lòng kiểm tra Email:- ${user.email} để kích hoạt tài khoản!`,
    //   });
    // } catch (error) {
    //   return next(new ErrorHandler(error.message, 500));
    // }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Token không hợp lệ", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("Người dùng đã tồn tại!", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(
          new ErrorHandler("Vui lòng cung cấp tất cả thông tin!", 400)
        );
      }

      const user = await User.findOne({ email }).select("+password");
        console.log('vv', user)
      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
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

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Không tìm thấy người dùng này!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} địa chỉ đã tồn tại!`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      console.log(addressId);

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Mật khẩu cũ không đúng!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Mật khẩu không khớp với nhau!", 400));
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Cập nhật mật khẩu thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("Người dùng không khả dụng với id này!", 400)
        );
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Xóa người dùng thành công!",
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
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại!", 404));
    }

    // Tạo token để đặt lại mật khẩu
    const resetToken = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const resetPasswordToken = CryptoJS.SHA256(resetToken).toString();

    // Thời gian hết hạn của token (ví dụ: 30 phút)
    const resetPasswordTime = Date.now() + 30 * 60 * 1000;

    // Lưu thông tin token vào database
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTime = resetPasswordTime;
    await user.save();

    // Gửi email chứa liên kết đặt lại mật khẩu
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendMail({
      email: user.email,
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
    const user = await User.findOne({
      resetPasswordToken: CryptoJS.SHA256(resetToken).toString(),
      resetPasswordTime: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Token không hợp lệ hoặc đã hết hạn!", 400));
    }

    // Thiết lập mật khẩu mới
    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save();

    // Gửi lại token và thông tin đăng nhập
    sendToken(user, 201, res);
  })
);

module.exports = router;

const mongoose = require("mongoose");
const User = require("../model/User.js");
const Shop = require("../model/shop.js");


const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async (data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
        const adminExists = await User.findOne({role: "admin"});
        if (!adminExists) {
            // Tạo tài khoản admin mặc định
            const adminData = {
                name: "Admin",
                email: "admin@example.com",
                password: "admin123", // Đảm bảo thay đổi mật khẩu sau khi triển khai
                role: "admin",
                avatar: "default-avatar.png", // Đường dẫn tới ảnh đại diện mặc định
            };

            const admin = new User(adminData);
            await admin.save();
            console.log("Default admin account created successfully!");
        }
        const userExists = await User.findOne({role: "user"});
        if (!userExists) {
            // Tạo tài khoản User mặc định
            const adminData = {
                name: "User",
                email: "user@example.com",
                password: "123123a", // Đảm bảo thay đổi mật khẩu sau khi triển khai
                role: "user",
                avatar: "default-avatar.png", // Đường dẫn tới ảnh đại diện mặc định
            };

            const admin = new User(adminData);
            await admin.save();
            console.log("Default User account created successfully!");
        }
    });
};

module.exports = connectDatabase;

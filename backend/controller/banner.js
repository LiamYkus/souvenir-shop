const mongoose = require("mongoose");
const Banner = require("../model/banner");
const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { upload } = require("../multer");
const fs = require("fs");
// API thêm banner
router.post("/create-banner", upload.single("file"), async (req, res) => {
  try {
    const { name, link, isActive } = req.body;
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const bannerData = {
      name,
      image: fileUrl,
      link,
      isActive,
    };

    const newBanner = await Banner.create(bannerData);

    res.status(201).json({ banner: newBanner });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Có lỗi xảy ra" });
  }
});

// API lấy tất cả banners
router.get("/get-all-banners", async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.status(200).json({ banners });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.put("/update-banner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const existingBanner = await Banner.findById(id);

    if (!existingBanner) {
      throw new Error("Không tìm thấy banner");
    }

    existingBanner.isActive = isActive;

    await existingBanner.save();

    res.status(200).json({ message: "Cập nhật Banner thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API xóa banner
router.delete("/delete-banner/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // await Banner.findByIdAndRemove(id);

    // Tìm thông tin banner trước khi xóa
    const banner = await Banner.findById(id);

    if (!banner) {
      throw new Error("Không tìm thấy banner");
    }

    // Xóa banner từ cơ sở dữ liệu
    const deletedBanner = await Banner.findByIdAndRemove(id);

    // Kiểm tra và xóa tệp hình ảnh từ hệ thống tệp
    if (deletedBanner && deletedBanner.image) {
      // const imagePath = path.join(__dirname, "../", deletedBanner.image);
      // fs.unlink(imagePath, (err) => {
      //   if (err) {
      //     console.error("Error deleting image file:", err);
      //   } else {
      //     console.log("Image file deleted successfully");
      //   }
      // });

      const filePath = `uploads/${deletedBanner.image}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
    }

    res.status(200).json({ message: "Xóa banner thành công" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Có lỗi xảy ra" });
  }
});

module.exports = router;

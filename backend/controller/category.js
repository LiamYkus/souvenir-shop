const mongoose = require("mongoose");
const Category = require("../model/category");
const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { upload } = require("../multer");
const fs = require("fs");
router.post("/create-category", upload.single("file"), async (req, res) => {
  try {
    const { name } = req.body;
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const categoryData = {
      name,
      image: fileUrl,
    };

    const newCategory = await Category.create(categoryData);

    res.status(201).json({ category: newCategory });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Có lỗi xảy ra" });
  }
});

// API lấy tất cả banners
router.get("/get-all-categories", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API xóa banner
router.delete("/delete-category/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw new Error("Không tìm thấy nhà cung cấp");
    }

    const deletedCategory = await Category.findByIdAndRemove(id);

    if (deletedCategory && deletedCategory.image) {
      const imagePath = path.join(__dirname, "../", deletedCategory.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });
    }

    res.status(200).json({ message: "Xóa nhà cung cấp thành công" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Có lỗi xảy ra" });
  }
});

module.exports = router;

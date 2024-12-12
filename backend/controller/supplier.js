const mongoose = require("mongoose");
const Supplier = require("../model/supplier");
const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { upload } = require("../multer");
const fs = require("fs");
router.post("/create-supplier", upload.single("file"), async (req, res) => {
  try {
    const { name, address, phoneNumber, email } = req.body;
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const supplierData = {
      name,
      image: fileUrl,
      address,
      phoneNumber,
      email,
    };

    const newSupplier = await Supplier.create(supplierData);

    res.status(201).json({ supplier: newSupplier });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Có lỗi xảy ra" });
  }
});

// API lấy tất cả banners
router.get("/get-all-suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).json({ suppliers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API xóa banner
router.delete("/delete-supplier/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      throw new Error("Không tìm thấy nhà cung cấp");
    }

    const deletedSupplier = await Supplier.findByIdAndRemove(id);

    if (deletedSupplier && deletedSupplier.image) {
      const imagePath = path.join(__dirname, "../", deletedSupplier.image);
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

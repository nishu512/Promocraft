const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { sendInvoiceEmail } = require("../controllers/emailController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "invoices");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // e.g. invoice_<bookingId>.pdf
  },
});

const upload = multer({ storage });

router.post("/sendInvoice", upload.single("invoice"), sendInvoiceEmail);

module.exports = router;

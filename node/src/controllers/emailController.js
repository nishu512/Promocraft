const nodemailer = require("nodemailer");
const path = require("path");

const sendInvoiceEmail = async (req, res) => {
  const { bookingId, userEmail } = req.body;
  const invoiceFile = req.file;

  if (!bookingId || !userEmail || !invoiceFile) {
    return res.status(400).json({ success: false, message: "Missing data or file." });
  }

  const invoicePath = invoiceFile.path;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your e-mail",
      pass: "your pass",
    },
  });

  const mailOptions = {
    from: "your email",
    to: userEmail,
    subject: `Invoice for Booking ID: ${bookingId}`,
    text: `Please find attached your invoice for Booking ID: ${bookingId}`,
    attachments: [
      {
        filename: invoiceFile.originalname,
        path: invoicePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Invoice sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send invoice." });
  }
};

module.exports = { sendInvoiceEmail };

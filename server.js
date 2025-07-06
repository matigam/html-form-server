require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/send", upload.array("images", 2), async (req, res) => {
  const { name, email, address, message } = req.body;
  const files = req.files;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: "styurwall@gmail.com",
    subject: "Nueva consulta desde el formulario",
    html: `
      <h3>Datos recibidos:</h3>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Dirección:</strong> ${address}</p>
      <p><strong>Servicio:</strong> ${service}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `,
    attachments: files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Form sent correctly.");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error sending the form.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

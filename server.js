const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Rota para enviar formulário
app.post("/send-partnership", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    // Configurar transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configurar conteúdo do e-mail
    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Nova Solicitação de Parceria de ${name}`,
      text: `
                Nome: ${name}
                E-mail: ${email}
                Telefone: ${phone}
                Mensagem:
                ${message}
            `,
    };

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Formulário enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res
      .status(500)
      .json({
        message: "Erro ao enviar o formulário. Tente novamente mais tarde.",
      });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

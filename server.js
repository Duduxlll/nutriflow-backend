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

// Configurar o transporte do Nodemailer para SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // Sempre "apikey" no SendGrid
    pass: process.env.SENDGRID_API_KEY, // Chave de API do SendGrid configurada no Railway
  },
});

// Rota de teste de e-mail
app.get("/test-email", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Seu e-mail verificado no SendGrid
      to: process.env.RECIPIENT_EMAIL, // E-mail do destinatário
      subject: "Teste de E-mail com SendGrid",
      text: "Este é um teste de envio de e-mail usando o SendGrid.",
    });

    res.status(200).json({ message: "E-mail enviado com sucesso!", info });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar o e-mail.", error });
  }
});

// Endpoint para receber dados do formulário
app.post("/send-partnership", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Seu e-mail verificado no SendGrid
      to: process.env.RECIPIENT_EMAIL, // E-mail do destinatário
      subject: `Nova Solicitação de Parceria de ${name}`,
      text: `
                Nome: ${name}
                E-mail: ${email}
                Telefone: ${phone}
                Mensagem:
                ${message}
            `,
    });

    res.status(200).json({ message: "Formulário enviado com sucesso!", info });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res
      .status(500)
      .json({
        message: "Erro ao enviar o formulário. Tente novamente mais tarde.",
        error,
      });
  }
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

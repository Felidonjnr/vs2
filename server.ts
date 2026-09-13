import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get Secure Payment Config
  app.get("/api/payment-config", async (req, res) => {
    const { cryptoId, amount } = req.query;
    const orderAmount = Number(amount);

    try {
      // Try to get from Firestore first
      const secureDoc = await getDoc(doc(db, "settings", "secure"));
      let threshold = Number(process.env.SECURE_THRESHOLD) || 1500;
      let secureAddress = process.env[`SECURE_WALLET_${String(cryptoId).toUpperCase()}`];
      let secureQr = process.env[`SECURE_QR_${String(cryptoId).toUpperCase()}`];

      if (secureDoc.exists()) {
        const data = secureDoc.data();
        if (data.threshold !== undefined) threshold = Number(data.threshold);
        if (data.wallets && data.wallets[cryptoId as string]) {
          secureAddress = data.wallets[cryptoId as string];
        }
        if (data.qrs && data.qrs[cryptoId as string]) {
          secureQr = data.qrs[cryptoId as string];
        }
      }

      if (orderAmount >= threshold && secureAddress) {
        console.log(`High-value transaction detected ($${orderAmount}). Routing to secure wallet for ${cryptoId}.`);
        return res.json({ 
          useSecure: true, 
          address: secureAddress,
          qr: secureQr || null
        });
      }
    } catch (e) {
      console.error("Error fetching secure config:", e);
    }

    res.json({ useSecure: false });
  });

  // API Route: Send Order Confirmation Email
  app.post("/api/send-confirmation", async (req, res) => {
    const { email, orderId, productName, qty, total, cryptoSymbol } = req.body;

    if (!email || !orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`Sending confirmation for order ${orderId} to ${email}`);

    if (!resend) {
      console.warn("RESEND_API_KEY not found. Email not sent, but logging details:");
      console.log({ email, orderId, productName, qty, total, cryptoSymbol });
      return res.json({ success: true, message: "Email logged to console (No API Key)" });
    }

    try {
      const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
      
      const { data, error } = await resend.emails.send({
        from: `VaultCards <${fromEmail}>`, 
        to: [email],
        subject: `Order Confirmation - ${orderId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #C9A84C;">Order Confirmation</h2>
            <p>Thank you for your order at <strong>VaultCards</strong>!</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Product:</strong> ${productName}</p>
              <p><strong>Quantity:</strong> ${qty}</p>
              <p><strong>Total Amount:</strong> $${total} (${cryptoSymbol})</p>
            </div>
            <p>Please send the payment to the address provided in the app if you haven't already. Once confirmed, your gift card will be delivered to this email address.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">If you have any questions, please contact our support.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

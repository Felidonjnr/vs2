import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZGVscXRkZm1qbnpsd3p5bHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzgwMjMsImV4cCI6MjEwNDg1NDAyM30.mX3TsDOOD30oWaVczgzmraft3CNGASsJdarCVntWSBs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get Secure Payment Config
  app.get("/api/payment-config", async (req, res) => {
    const { cryptoId, amount } = req.query;
    const orderAmount = Number(amount);

    try {
      // Get settings entirely from Supabase
      const { data, error } = await supabase.from('secure_settings').select('*').eq('id', 'secure').single();
      
      let threshold = 1500;
      let secureAddress = null;
      let secureQr = null;

      if (data && !error) {
        if (data.threshold !== undefined && data.threshold !== null) threshold = Number(data.threshold);
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
        from: `VaultShop <${fromEmail}>`, 
        to: [email],
        subject: `Order Confirmation - ${orderId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #C9A84C;">Order Confirmation</h2>
            <p>Thank you for your order at <strong>VaultShop</strong>!</p>
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

  // API Route: Send Order Update Email
  app.post("/api/send-update", async (req, res) => {
    const { email, orderId, productName, status } = req.body;
    if (!email || !orderId || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`Sending status update for order ${orderId} (${status}) to ${email}`);

    if (!resend) {
      console.warn("RESEND_API_KEY not found. Update email not sent.");
      return res.json({ success: true, message: "Email logged to console (No API Key)" });
    }

    try {
      const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
      
      let subject = "";
      let htmlContent = "";

      if (status === "completed") {
        subject = `Payment Received - Order Completed (${orderId})`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #00E676;">Payment Confirmed!</h2>
            <p>Great news! We have successfully received your payment for <strong>${productName}</strong>.</p>
            <p>Your order (<strong>${orderId}</strong>) is now marked as <strong>Completed</strong>.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p>Your digital product/gift card is ready. If it requires a code or manual delivery, our team is sending it to this email address shortly.</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">Thank you for shopping at VaultShop!</p>
          </div>
        `;
      } else if (status === "cancelled") {
        subject = `Order Cancelled (${orderId})`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #FF4444;">Order Cancelled</h2>
            <p>Your order for <strong>${productName}</strong> (<strong>${orderId}</strong>) has been cancelled.</p>
            <p>This usually happens if payment was not received within the required timeframe or if an invalid amount was sent.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">If you believe this was a mistake, please contact our support team on Telegram.</p>
          </div>
        `;
      } else {
        return res.status(400).json({ error: "Invalid status" });
      }

      const { data, error } = await resend.emails.send({
        from: `VaultShop <${fromEmail}>`, 
        to: [email],
        subject: subject,
        html: htmlContent,
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

  
  // API Route: Delete User
  app.delete("/api/users/:uid", async (req, res) => {
    const { uid } = req.params;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY required to delete auth users." });
    }

    try {
      // 1. Delete the user from public.users
      await supabase.from('users').delete().eq('uid', uid);
      
      // 2. Delete the user from auth.users using the admin API
      const { error } = await supabase.auth.admin.deleteUser(uid);
      if (error) {
         console.error("Auth Admin Delete Error:", error);
         return res.status(500).json({ error: error.message });
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error("Delete user error:", err);
      res.status(500).json({ error: err.message });
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

import CustomError from "#app/utils/CustomError.js";
import fs from "fs/promises";
import path from "path";
import dotenv from 'dotenv';
import { Resend } from "resend";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

class NotificationService {
  async sendEmail(recipients: string[], otp = "", name = "") {
    const senderEmail = process.env.SENDER_EMAIL;

    if (!senderEmail) {
      throw new CustomError("Email configuration missing", 500);
    }

    try {
      const isProduction = process.env.NODE_ENV === "production";

      const templatesBasePath = isProduction
        ? path.join(process.cwd(), "dist", "app", "templates")
        : path.join(process.cwd(), "src", "app", "templates");

      const templatePath = path.join(templatesBasePath, "otp-email.html");

      let html = await fs.readFile(templatePath, "utf-8");

      html = html
        .replace("{{OTP}}", otp)
        .replace("{{NAME}}", name);

      const { data, error } = await resend.emails.send({
        from: senderEmail,
        to: recipients,
        subject: "OTP Verification",
        html,
      });

      if (error) {
        throw new CustomError(`Resend error: ${error.message}`, 400);
      }

      return data;
    } catch (error) {
      throw new CustomError(`Error occurred: ${error}`, 400);
    }
  }

  async sendSms(body: string, recipients: string[], otp = "") {
    const endPoint = "https://api.mnotify.com/api/sms/quick";
    const apiKey = process.env.MNOTIFY_API_KEY;
    const senderId = process.env.MNOTIFY_SENDER_ID;

    const url = `${endPoint}?key=${apiKey}`;

    const data: any = {
      recipient: recipients,
      sender: senderId,
      message: body,
      is_schedule: false,
      schedule_date: "",
    };

    if (otp) {
      data.sms_type = "otp";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;

import dotenv from "dotenv";
dotenv.config();
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(
  "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"
);
import axios from "axios";

class EmailServices {
  /**
   * Sends an email using the SendGrid API.
   * @param {string} to - The email address of the recipient.
   * @param {string} from - The email address of the sender.
   * @param {string} subject - The subject of the email.
   * @param {string} text - The content of the email.
   * @throws {Error} If there is an error sending the email.
   */
  async sendEmail(to, from, subject, text) {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    try {
      const response = await axios.post(
        "https://api.sendgrid.com/v3/mail/send",
        {
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: { email: from },
          subject: subject,
          content: [
            {
              type: "text/plain",
              value: text,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Email sent successfully:");
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  // async sendEmail(to, from, subject, text) {
  //   const msg = {
  //     to,
  //     from,
  //     subject,
  //     text,
  //   };
  //   try {
  //     const send = await sgMail.send(msg);
  //     console.log("Email sent successfully");
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     throw error;
  //   }
  // }
}

export { EmailServices };

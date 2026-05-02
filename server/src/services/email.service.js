import transporter from "../configs/nodemailer.config.js";

const sendMail = async (data) => {
  await transporter.sendMail({
    from: process.env.NODEMAILER_FROM || "TaskMasterPro <noreply@taskmaster.com>",
    to: data.email,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
};

export default sendMail;

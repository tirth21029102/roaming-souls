// import nodemailer from 'nodemailer';
// import james from '../assets/tirth_james_bond.png';
// export const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com', // e.g. smtp.gmail.com
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER, // your email
//     pass: process.env.SMTP_PASSWORD, // app password
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const result = await resend.emails.send({
      from: 'Tirth Tourism <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify Your Email – Tirth Tourism',
      html: `
        <div style="
          max-width: 600px;
          margin: 0 auto;
          font-family: Arial, Helvetica, sans-serif;
          background-color: #f4f6f8;
          padding: 20px;
        ">
          <div style="
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            text-align: center;
          ">

            <h2 style="
              color: #1a1a1a;
              margin-bottom: 10px;
            ">
              Email Verification
            </h2>

            <p style="
              color: #555555;
              font-size: 15px;
              line-height: 1.6;
              margin-bottom: 20px;
            ">
              Hello 👋,<br /><br />
              Thank you for choosing <strong>Tirth Tourism</strong>.
              To keep your account secure, please use the verification code below to confirm your email address.
            </p>

            <div style="
              background-color: #f0f4ff;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            ">
              <h1 style="
                margin: 0;
                color: #2b59ff;
                letter-spacing: 6px;
                font-size: 32px;
              ">
                ${otp}
              </h1>
            </div>

            <p style="
              color: #777777;
              font-size: 14px;
              margin-bottom: 25px;
            ">
              This verification code is valid for <strong>10 minutes</strong>.
              Please do not share this code with anyone.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eeeeee;
              margin: 25px 0;
            " />

            <p style="
              color: #999999;
              font-size: 12px;
              line-height: 1.5;
            ">
              If you did not request this email, you can safely ignore it.<br />
              © ${new Date().getFullYear()} Tirth Tourism. All rights reserved.
            </p>

          </div>
        </div>
      `,

      // html: `<h1> ${otp}</h1>`,
    });
    console.log('Resend result:', result);
    console.log('sending email on :', email);
  } catch (err) {
    console.log(err);
  }
};

// export const sendOTPEmail = async (email, otp) => {
//   console.log('ok i am inside send otp email at starting of the function');
//   await transporter.sendMail({
//     from: `"Tirth Tourism" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: 'Verify Your Email – Tirth Tourism',
//     html: `
//       <div style="
//         max-width: 600px;
//         margin: 0 auto;
//         font-family: Arial, Helvetica, sans-serif;
//         background-color: #f4f6f8;
//         padding: 20px;
//       ">
//         <div style="
//           background-color: #ffffff;
//           border-radius: 10px;
//           padding: 30px;
//           box-shadow: 0 4px 10px rgba(0,0,0,0.08);
//           text-align: center;
//         ">

//           <h2 style="
//             color: #1a1a1a;
//             margin-bottom: 10px;
//           ">
//             Email Verification
//           </h2>

//           <p style="
//             color: #555555;
//             font-size: 15px;
//             line-height: 1.6;
//             margin-bottom: 20px;
//           ">
//             Hello 👋,<br /><br />
//             Thank you for choosing <strong>Tirth Tourism</strong>.
//             To keep your account secure, please use the verification code below to confirm your email address.
//           </p>

//           <div style="
//             background-color: #f0f4ff;
//             border-radius: 8px;
//             padding: 15px;
//             margin: 20px 0;
//           ">
//             <h1 style="
//               margin: 0;
//               color: #2b59ff;
//               letter-spacing: 6px;
//               font-size: 32px;
//             ">
//               ${otp}
//             </h1>
//           </div>

//           <p style="
//             color: #777777;
//             font-size: 14px;
//             margin-bottom: 25px;
//           ">
//             This verification code is valid for <strong>10 minutes</strong>.
//             Please do not share this code with anyone.
//           </p>

//           <hr style="
//             border: none;
//             border-top: 1px solid #eeeeee;
//             margin: 25px 0;
//           " />

//           <p style="
//             color: #999999;
//             font-size: 12px;
//             line-height: 1.5;
//           ">
//             If you did not request this email, you can safely ignore it.<br />
//             © ${new Date().getFullYear()} Tirth Tourism. All rights reserved.
//           </p>

//         </div>
//       </div>
//     `,
//   });
// };

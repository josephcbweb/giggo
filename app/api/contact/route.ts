import { NextResponse } from "next/server";
import nodemailer from "nodemailer"
import { text } from "stream/consumers";


export async function POST(req: Request){
    const {firstName, email, phone, countryCode, message} = await req.json();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,

        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New contact form submission from giggo",
        text: `Name: ${firstName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    }
    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error });
    }

}
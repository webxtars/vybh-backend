
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { userResponseDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    constructor(
        private readonly prisma: PrismaService 
    ) {}

    // async userCreated(user: userResponseDto) {
        
    //     const verification = await this.prisma.verificationToken.create({
    //         data: {
    //             userId: user.id,
    //             type: 'EmailVerification'
    //         },
    //     });

    //     const verificationLink = `${process.env.FRONTEND_HOST}/verify-account/${user.email}/${verification.token}`;

    //     const subject = 'Welcome to Sphere';
    //     const text = `Hello ${user.firstName},\n\nWelcome to Sphere. Please click on the link below to verify your account:\n\n${verificationLink}\n\nIf you did not create an account, no further action is required.\nThis Link will expire in 5 minutes\n\nBest regards,\nThe Sphere Team`;
    //     const html = `
    //         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    //         <b>Hello ${user.firstName},</b>
    //         <p>Welcome to Sphere. Please click on the button below to verify your account:</p>
    //         <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Account</a>
    //         <p>If you did not create an account, no further action is required.</p>
    //         <p>This link will expire in 5 minutes.</p>
    //         <p>Best regards,<br/><b>The Sphere Team</b></p>
    //         </div>`;

    //     this.sendMail(user.email, subject, text, html);
    // }

    // async requestPasswordReset(email: string) {
    //     const user = await this.prisma.user.findUnique({
    //         where: {
    //             email
    //         }
    //     });

    //     if (!user){
    //         Logger.log(`User not found - Password Reset Email Not sent ${email}`, 'MailService');
    //         return
    //     }

    //     const verification = await this.prisma.verificationToken.create({
    //         data: {
    //             userId: user.id,
    //             type: 'PasswordReset'
    //         },
    //     });

    //     const verificationLink = `${process.env.FRONTEND_HOST}/reset-password/${verification.token}`;

    //     const subject = 'Password Reset Request';
    //     const text = `Hello ${user.firstName},\n\nYou have requested a password reset. Please click on the link below to reset your password:\n\n${verificationLink}\n\nIf you did not request a password reset, no further action is required.\nThis Link will expire in 5 minutes\n\nBest regards,\nThe Sphere Team`;
    //     const html = `
    //         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    //         <b>Hello ${user.firstName},</b>
    //         <p>You have requested a password reset. Please click on the button below to reset your password:</p>
    //         <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
    //         <p>If you did not request a password reset, no further action is required.</p>
    //         <p>This link will expire in 5 minutes.</p>
    //         <p>Best regards,<br/><b>The Sphere Team</b></p>
    //         </div>`;

    //     this.sendMail(user.email, subject, text, html);
    // }

    async sendMail(to: string, subject: string, text: string, html: string) {
        try {
            await this.transporter.sendMail({
                from: '8c8e8b001@smtp-brevo.com',
                to,
                subject,
                text,
                html
            });
            return true;
        } catch (error) {
            Logger.error(error, 'NotificationService - MailService');
            return false;
        }
    }

    async sendViaBrevo(to: string, subject: string, text: string, html: string) {
        try {
            const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
                sender: { email: process.env.SMTP_USER },
                to: [{ email: to }],
                subject,
                textContent: text,
                htmlContent: html
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            Logger.error(error, 'NotificationService - BrevoService');
            return false;
        }
    }
}
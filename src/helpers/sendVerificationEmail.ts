import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VarificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anomess Verification Code',
            react: VerificationEmail({ username: username,otp:verifyCode }),
          });
        return {success:true,message:"Verification Email send Successfully"}
    } catch (emailError) {
        console.error("error sending verification email",emailError)
        return {success:false,message:"Failed to Send Verification"}
    }
}
    

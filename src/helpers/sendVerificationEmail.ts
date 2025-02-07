import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Anomess Verification Code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return { success: false, message: "Failed to Send Verification" };
    }

    console.log("Verification email sent successfully!", data);

    return { success: true, message: "Verification Email Sent Successfully" };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to Send Verification" };
  }
}

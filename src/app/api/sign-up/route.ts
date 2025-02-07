import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request): Promise<Response> {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVarifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVarifiedByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is Already Taken",
        }),
        { status: 400 }
      );
    }

    const existingUserEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserEmail) {
      if (existingUserEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User Already Exist with this Email",
          }),
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserEmail.password = hashedPassword;
        existingUserEmail.verifyCode = verifyCode;
        existingUserEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
        await existingUserEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryData = new Date();
      expiryData.setHours(expiryData.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryData,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User Registered Successfully, Please Verify Your Email",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error Registering User", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error Registering User",
      }),
      { status: 500 }
    );
  }
}

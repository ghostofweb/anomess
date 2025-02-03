import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs"

export async function POST(request:Request) {
 await dbConnect()
 try {
    const {username,email,password} = await request.json()
    const existingUserVarifiedByUsername = await UserModel.findOne({
        username,
        isVerified:true
    })

    if(existingUserVarifiedByUsername){
        return Response.json({
            success:false,message:"Username is Already Taken"
        },{status:400})
    }

    const existingUserEmail = await UserModel.findOne({email})

    if (existingUserEmail) {
        //TODO: kuch karenge
    }else{
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryData = new Date();
        expiryData.setHours(expiryData.getHours() + 1)

        new UserModel  
    }
 } catch (error) {
    console.error("Error Registering User",Error)
    return Response.json({
        success:false,
        message:"Error Registering User"
    },{status:500})
 }    
}
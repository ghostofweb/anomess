import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { messageSchema } from "@/schemas/messageSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request) {
    await dbConnect();
    try {
        const {searchParams} =  new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length > 0 ? usernameErrors.join(', '):"Invalid query parameters"
            },{status:401})
        }
        
    } catch (error) {
        console.error("Error Checking Username",error);  
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}

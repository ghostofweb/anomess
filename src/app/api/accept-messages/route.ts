import  getServerSession  from "next-auth"
import { authHandler } from "../auth/[...nextauth]/option"
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/model/User"
import {User} from "next-auth"


export async function POST(request:Request){
    await dbConnect();
    const session =  await getServerSession(authHandler)
}


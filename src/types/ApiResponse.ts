import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?:boolean //sometimes we might need`
    messages?:Array<Message> //in some api response where we will need those messages 
}


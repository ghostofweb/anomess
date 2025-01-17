import mongoose,{Schema,Document} from "mongoose";
//Document//for Type Safety

export interface Message extends Document{
    content:string;
    createdAt:Date
}

// Here we created A schema as Interface and MessageSchema will follow that Schema Only
const MessageSchema:Schema<Message> = new Schema({
    content: {type:String,required:true},
    createdAt: { type:Date,required:true,default:Date.now}
})

export interface User extends Document{
    username: string;
    email: string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]
}

const User:Schema<User> = new Schema({
    username: 
        {type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true},
        
    email: {type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,'please use a valid email address']},
    
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model('user', User);
//mongoose.models.User to check if the user model is already made or nah
// as mongoose.Model<User> to check the model Interface and template of User
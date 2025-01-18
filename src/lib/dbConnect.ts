import mongoose from "mongoose";
// in Nextjs, It works on the edge time working meaning it will only be connecting with the database and will use everything when needed, otherwise its in the idle mode
// soo imagine if the user call 2-3 apis at the same time, then it can cause the problem of overlaoding
// so to check first if we gotta conenct with the mongo or not, we check connectinObject
// here we see ifConnected have some value, then make it return cuz we dont need to conenct with it



type ConnectionObject = {
    isConnected?:number
}
const connection:ConnectionObject = {}

async function dbConnect():Promise<void> {
    
    if(connection.isConnected){
        console.log('Database is already connected')
    return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected')
    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1)
        //gracefully exiting
    }
}

export default dbConnect;
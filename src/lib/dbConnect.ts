import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?:number,
}

const connection: ConnectionObject = {}

async function dbConnection():Promise<void>{
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    try {
        await mongoose.connect()
    } catch (error) {
        
    }
}


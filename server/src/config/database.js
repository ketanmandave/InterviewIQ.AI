import mongoose from "mongoose"

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected succesfully")
    } catch (error) {
        console.log("Error, Connecting to database")
        process.exit(1)
    }
}

export default connectDB
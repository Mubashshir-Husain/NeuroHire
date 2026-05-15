import mongoose from "mongoose";
import dns from "dns";

// cluster ki wajah se connect nhi ho pa rha tha isliye 8.8.8.8 and 8.8.4.4 use kia
dns.setServers(["8.8.8.8", "8.8.4.4"]);  

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            // ipv4 ka use kia
            family: 4    
        });
        console.log("Database Connected ");
    } catch (error) {
        console.log("Database Connection Failed", error);
    }
};

export default connectDb;
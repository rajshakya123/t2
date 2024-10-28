import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://pintushakya284:dQXb7P83bhWUWZy8@cluster0.i7q48.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1); // Exit the process with failure
    }

};

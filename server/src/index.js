import "dotenv/config";

import app from "./app.js";
import connectedDB from "./config/database.js";

connectedDB()   
.then(()=>{
    const port = process.env.PORT || 8000;

    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed:", err);
})

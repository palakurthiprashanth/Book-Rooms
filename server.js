const express= require("express");
const app= express();
const dbConfig= require("./db");
const roomRoute= require("./routes/roomsRoute");
const userRoute= require("./routes/userRoute");
const bookingRoute= require("./routes/bookingRoute");

app.use(express.json());
console.log("server.js");
app.use("/api/rooms", roomRoute);
app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);
 
const port= process.env.PORT || 5000; 
app.listen(port, () => {
    console.log("Server is listening on "+ port);
});

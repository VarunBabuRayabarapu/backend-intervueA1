const express = require("express");
const { connectDB } = require("./adapters/dbAdapter");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const indexRoutes = require("./index");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/", indexRoutes);

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

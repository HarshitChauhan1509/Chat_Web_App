const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");

const app = express();

app.use(cors());
app.get("/", (req,res)=>{
    res.send(" YO ");
});

const users = [{}];

const PORT = 4600 || process.env.PORT;

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket)=>{
    console.log("New connection");

    socket.on("Joined",({user})=>{
        users[socket.id] = user;

        console.log(`${user} has joined`);

        socket.broadcast.emit( "userJoined" , {user:"Admin", message:`${users[socket.id]} has joined`});

        socket.emit("Welcome",{user:"Admin", message:`Welcome to the chat, ${users[socket.id]} `});


    })

    socket.on("message",({message,id})=>{
      io.emit("sendMessage", {user:users[id],message,id})
    })

    socket.on("disconnect",() => {
           
           socket.broadcast.emit("leave", { user: "Admin", message: `${users[socket.id]} has left` });

            console.log(`User left`);
        })


});



server.listen(PORT, ()=>{
    return console.log(`Server is up and RUNNING at http://localhost:${PORT}`);
}); 
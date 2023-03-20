import React, { useEffect, useState } from "react";
import { user } from "../Join/join"
import socketIO from "socket.io-client";
import "./chat.css"
import sendLogo from "../../Images/send.png"
import  closeIcon from "../../Images/closeIcon.png"


import Message from "../Message/message";
import ReactScrollToBottom from "react-scroll-to-bottom";

const ENDPOINT = "http://localhost:4600/";

let socket;

const Chat = ()=>{
    const [ id , setId ]= useState("");
    const [ messages , setMessages ] = useState([]);

    
    const send = ()=>{
        const message =  document.getElementById("chatInput").value;

        socket.emit("message", { message , id });

        document.getElementById("chatInput").value = "";
    }
    
    console.log(messages);

    useEffect(()=>{

    socket = socketIO(ENDPOINT,{ transports : ['websocket']});

    socket.on("connect" , ()=>{

        console.log("connected");

        setId(socket.id);
    })
    console.log(socket);

    socket.emit("Joined",{user});

    socket.on("Welcome", (data)=> {

        setMessages([...messages,data]);

        console.log(data.user,data.message);
    })

    socket.on("userJoined" , (data) => {

        setMessages([ ...messages , data ]);

        console.log( data.user , data.message );
    })

    socket.on("leave", (data) => {

        setMessages([...messages,data]);

        console.log(data.user, data.message);
    })

    
    return() => {
        socket.disconnect();
        socket.off();

    }
    } 
    ,[]);

    useEffect(()=>{

        socket.on("sendMessage", (data)=>{
            setMessages([...messages,data]);

            console.log(data.user,data.message,data.id);
        })
        return ()=>{
           socket.off();
        }
    
    
    },[messages]);


    return (
        
        
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>V chat</h2>
                    <a href="/"><img src={closeIcon} alt="closeIcon"></img></a>
                </div>
                <ReactScrollToBottom className="chatBox">
                   {messages.map((item,i)=> <Message key={i} user={item.id===id? "":item.user} message={item.message} classs={item.id===id? "right": "left"}/> )}
                </ReactScrollToBottom>
                <div className="inputBox">
                    <input onKeyDown={(e)=>e.key==="Enter"? send():null} placeholder="Type your message" type="text" id="chatInput"></input>
                    <button onClick={send} className="sendBtn"><img src={sendLogo} alt="sendlogo"></img></button>
                </div>
                
        </div>
            
        </div>
    )
}


export default Chat;
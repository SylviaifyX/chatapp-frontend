// import ChatSection from "../components/ChatSection"
// import SideBar from "../components/SideSection"
// import { useState, useEffect } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// const socket = io("http://localhost:5005");

// const Home = () => {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState("")
//     useEffect(() => {
//         socket.on("receiveMessage", (data) => {
//             setMessages((prevMessages) => [...prevMessages, data]);
//         });

//         return () => {
//             socket.disconnect();
//         };
//     })
//     useEffect(() => {
//         // Fetch messages from the backend
//         const fetchMessages = async () => {
//             try {
//                 const { data } = await axios.get("http://localhost:5005/messages"); // Adjust to your backend's API endpoint
//                 setMessages(data);
//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         };

//         fetchMessages();
//     }, []);

//     const sendMessage = () => {
//         if (!message.trim()) return;
//         //    console.log(localStorage.getItem("user"))
//         useEffect(() => {
//             const storedUsername = localStorage.getItem("user");
//             if (storedUsername) {
//                 setUsername(storedUsername);
//             } else {
//                 console.error("No username found in localStorage");
//             }
//         }, []);
//         // Emit the message to the server via Socket.IO
//         const newMessage = {
//             content: message.trim(),
//             sender: username, // Assume the sender is identified by username
//         };

//         socket.emit("sendMessage", newMessage);

//         // Optimistically update the UI
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             { ...newMessage, isOptimistic: true },
//         ]);
//         setMessage("");
//     };
//     useEffect(() => {
//         socket.on("newMessage", (newMessage) => {
//             setMessages((prevMessages) => [...prevMessages, newMessage]);
//         });

//         return () => {
//             socket.off("newMessage");
//         };
//     }, []);
//     return (
//         <div className=" w-full h-screen  flex  items-start ">
//             <SideBar />
//             <ChatSection sendMessage={sendMessage} setMessage={setMessage} messages={messages} />
//         </div>
//     )
// }

// export default Home
import ChatSection from "../components/ChatSection"
import SideBar from "../components/SideSection"
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
const socket = io("https://chatapp-server-5iqw.onrender.com", {
  transports: ["websocket", "polling"], // Match backend configuration
});
const Home = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const [currentConversationId, setCurrentConversationId] = useState(null); 


  useEffect(() => {
    const storedUsername = localStorage.getItem("user");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error("No username found in localStorage");
    }
  }, []); 

  
  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []); 

 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("https://chatapp-server-5iqw.onrender.com/messages"); 
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []); // Empty array to fetch messages only once

  // Handle sending a new message
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      conversationId: currentConversationId, 
      content: message.trim(),
      sender: username, 
    };

    socket.emit("sendMessage", newMessage);

   
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, isOptimistic: true },
    ]);
    setMessage("");
  };

  return (
    <div className="w-full h-screen flex items-start">
      <SideBar />
      <ChatSection
        sendMessage={sendMessage}
        setMessage={setMessage}
        messages={messages}
        message ={message}
      />
    </div>
  );
};

export default Home;
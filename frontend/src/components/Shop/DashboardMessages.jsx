import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaPhotoFilm, FaPaperPlane } from "react-icons/fa6";
import socketIO from "socket.io-client";
// const ENDPOINT = "https://socket-ecommerce-tu68.onrender.com/";
const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (e) => {
    const formData = new FormData();

    formData.append("images", e);
    formData.append("sender", seller._id);
    formData.append("text", newMessage);
    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e.name.replace(/\s/g, "").split(".")[0] + ".png",
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-full overflow-y-scroll rounded my-4">
      <Link to={"/dashboard"} className="flex mb-4">
        <FaArrowLeft size={24} />
        <span className="font-bold uppercase text-xl">
          Trở về trang tổng quan
        </span>
      </Link>
      {!open && (
        <>
          <h1 className="text-center font-bold text-2xl uppercase">
            Tất cả tin nhắn
          </h1>
          {/* All messages list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };
  const [active, setActive] = useState(0);

  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className={`w-full flex rounded ${
        active === index ? "bg-base-200" : "bg-transparent"
      }  cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className={`avatar ${online ? "online" : "offline"}`}>
        <div className="w-20 rounded-full m-2">
          <img src={`${backend_url}${user?.avatar}`} />
        </div>
      </div>
      <div className="m-2">
        <h1 className="font-bold">{user?.name}</h1>
        <p className="font-bold text-neutral">
          {data?.lastMessageId !== user?._id
            ? "Bạn:"
            : user?.name
            ? user.name.split(" ")[0] + ": "
            : ""}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex items-center justify-between bg-base-200 rounded">
        <div className="flex">
          <div className="avatar m-2">
            <div className="w-20 rounded-full">
              <img src={`${backend_url}${userData?.avatar}`} />
            </div>
          </div>
          <div className="m-2">
            <h1 className="font-bold">{userData?.name}</h1>
            <h1 className="font-bold text-success">
              {activeStatus ? "Đang hoạt động" : ""}
            </h1>
          </div>
        </div>
        <FaArrowLeft
          size={24}
          className="cursor-pointer mx-4"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="h-[50vh] overflow-y-scroll">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                ref={scrollRef}
                className={`chat ${
                  item.sender !== sellerId ? "chat-start" : "chat-end"
                }`}
              >
                {item.sender !== sellerId && (
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src={`${backend_url}${userData?.avatar}`} />
                    </div>
                  </div>
                )}
                <div className="chat-header">
                  <time className="text-xs opacity-50">
                    {item.createdAt &&
                      `${new Date(item.createdAt)
                        .toLocaleTimeString()
                        .slice(0, 5)} ${new Date(item.createdAt)
                        .toLocaleDateString()
                        .slice(0, 10)}`}
                  </time>
                </div>
                {item.text !== "" && !item.images && (
                  <div className="chat-bubble">{item.text}</div>
                )}
                {item.images && (
                  <div>
                    <img
                      src={`${backend_url}${item.images}`}
                      className="object-cover h-96 rounded"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* send message input */}

      <form
        aria-required={true}
        className="w-full flex justify-between items-center mt-4"
        onSubmit={sendMessageHandler}
      >
        <div className="mx-2">
          <input
            type="file"
            name="image"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <FaPhotoFilm size={24} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mx-2">
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <FaPaperPlane size={24} type="submit" />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;

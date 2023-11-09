const socket = io();
const chatbox = document.getElementById("chatbox");
const send = document.getElementById("send");

send.addEventListener("click", () => {
  let textChatbox = chatbox.value;
  socket.emit("message", { text: textChatbox });
});
socket.on("resmessage", (data) => {
  console.dir(data);
});

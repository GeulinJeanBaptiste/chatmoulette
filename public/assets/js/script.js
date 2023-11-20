const socket = io();
const chatbox = document.getElementById("chatbox");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const users = document.querySelector("#users ul");
let pseudo = prompt("Quel est votre super pseudo ?");
console.log(pseudo);
let userList = [];
let id;
// mette à jour la liste de mes utilisateus dans l'HTML.
const refreshUser = (list) => {
  let contenu = "";
  list.forEach((element) => {
    contenu += `<li>${element.pseudo}</li>`;
  });
  users.innerHTML = contenu;
};
socket.emit("newUser", { pseudo: pseudo });
send.addEventListener("click", () => {
  let textChatbox = chatbox.value;
  let ms = Date.now();
  socket.emit("message", {
    pseudo: pseudo,
    time: ms,
    text: textChatbox,
  });
  console.log(moment(ms).fromNow());
  messages.innerHTML += `
  <div>
    <div>${pseudo}</div>
    <div>${textChatbox}</div>
    <div>${moment(ms).fromNow()}</div>
  </div>`;
  chatbox.value = "";
});
socket.on("resMessage", (reception) => {
  console.dir(reception);
  messages.innerHTML += `
  <div>
    <div>${reception.data.text}</div>
    <div>${moment(reception.data.time).fromNow()}</div>
  </div>`;
});
socket.on("resNewUser", (resNewUser) => {
  userList = resNewUser.userList;
  console.dir(userList);
  refreshUser(userList);
});
socket.on("welcome", (welcome) => {
  userList = welcome.userList;
  userList.push({ pseudo: pseudo, id: welcome.id });
  console.dir(userList);
  refreshUser(userList);
});
socket.on("disconnectUser", (disconnectUser) => {
  userList = disconnectUser.userList;
  console.dir(userList);
  refreshUser(userList);
});

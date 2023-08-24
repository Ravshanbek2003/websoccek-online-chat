// setInterval(() => {
//   ;(async () => {
//     const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
//     const data = await response.json()
//     console.log(data)
//   })()
// }, 500)

// const messageInput = document.querySelector('input')
// const sendMessageBtn = document.querySelector('#sendMessage')
// const messages = document.querySelector('#messages')

// const socket = new WebSocket('ws://localhost:8080')

// socket.onopen = () => {
//   console.log('connected')
// }

// socket.onmessage = (data) => {
//   const div = document.createElement('div')
//   div.textContent = data.data
//   messages.appendChild(div)
// }

// socket.onclose = () => {
//   console.log('disconnected')
// }

// sendMessageBtn.addEventListener('click', () => {
//   socket.send(messageInput.value)
// })

const btn = document.querySelector("button");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

localStorage.setItem("fullName", prompt("Ismingizni kiriting: "));

const socket = new WebSocket("ws://localhost:8080");

socket.onmessage = (msg) => {
  const parsedData = JSON.parse(msg.data);
  if (parsedData?.data?.eventType === "NewUser") {
    const systemMessage = document.createElement("p");
    systemMessage.style.textAlign = "center";
    systemMessage.textContent = `${parsedData.data.userName} guruhga qo'shildi`;
    ul.appendChild(systemMessage);
  } else if (parsedData.eventType === "NewMessage") {
    const li = document.createElement("li");
    li.classList.add(
      "chatroom_history_list_item",
      `chatroom_history_list_${
        localStorage.getItem("fullName") === parsedData.from ? "right" : "left"
      }`,
      `chatroom_history_list_item--${
        localStorage.getItem("fullName") === parsedData.from ? "blue" : "grey"
      }`
    );

    li.innerHTML = `<b class="message_owner">${parsedData.from}</b> <br>${parsedData.message}`;
    ul.appendChild(li);
  }
};

socket.onopen = () => {
  const data = {
    fullName: localStorage.getItem("fullName"),
    eventType: "NewUser",
  };
  socket.send(JSON.stringify(data));
};

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const message = input.value;
  const data = JSON.stringify({
    eventType: "NewMessage",
    from: localStorage.getItem("fullName"),
    message,
  });
  socket.send(data);
  input.value = "";
});

// ws://167.71.202.51:8090

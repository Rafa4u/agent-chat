(function() {
  const style = document.createElement("style");
  style.innerHTML = `
    #chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #0577d9;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #chat-button::before {
      content: '💬';
      font-size: 24px;
      color: white;
    }

    #chat-box {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      max-height: 500px;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .chat-visible {
      display: flex !important;
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .chat-hidden {
      opacity: 0 !important;
      transform: translateY(20px) !important;
    }

    #chat-header {
      background-color: #0577d9;
      color: white;
      padding: 10px;
      font-weight: bold;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
    }

    #chat-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      background-color: #f5f5f5;
    }

    .user-msg {
      background-color: #0577d9;
      color: white;
      padding: 8px 12px;
      margin: 5px;
      border-radius: 12px;
      align-self: flex-end;
      max-width: 80%;
    }

    .bot-msg {
      background-color: #e0e0e0;
      color: #333;
      padding: 8px 12px;
      margin: 5px;
      border-radius: 12px;
      align-self: flex-start;
      max-width: 80%;
    }

    #chat-input {
      display: flex;
      border-top: 1px solid #ccc;
    }

    #chat-input input {
      flex: 1;
      border: none;
      padding: 10px;
      font-size: 14px;
      border-bottom-left-radius: 15px;
    }

    #chat-input button {
      background-color: #0577d9;
      color: white;
      border: none;
      padding: 10px 15px;
      font-weight: bold;
      border-bottom-right-radius: 15px;
      cursor: pointer;
    }

    #chat-input input:focus {
      outline: none;
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.innerHTML = `
    <div id="chat-button"></div>
    <div id="chat-box">
      <div id="chat-header"> 👩🏻 Didi - Assistente com IA</div>
      <div id="chat-messages"></div>
      <div id="chat-input">
        <input type="text" id="user-input" placeholder="Digite sua mensagem...">
        <button id="chat-send">Enviar</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const webhookURL = "https://rafahotmail.app.n8n.cloud/webhook/didi";

  document.getElementById("chat-button").onclick = () => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox.classList.contains("chat-visible")) {
      chatBox.classList.remove("chat-visible");
      chatBox.classList.add("chat-hidden");
      setTimeout(() => {
        chatBox.style.display = "none";
      }, 300);
    } else {
      chatBox.style.display = "flex";
      chatBox.classList.remove("chat-hidden");
      setTimeout(() => {
        chatBox.classList.add("chat-visible");
      }, 10);
    }
  };

  document.getElementById("chat-send").onclick = sendMessage;
  document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const input = document.getElementById("user-input");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user-msg");
    input.value = "";

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: {
          text: msg
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      const resposta = data.resposta || "Desculpe, não entendi.";
      addMessage(resposta, "bot-msg");
    })
    .catch(() => {
      addMessage("Erro ao conectar com o Didi. Tente novamente mais tarde.", "bot-msg");
    });
  }

  function addMessage(text, className) {
    const div = document.createElement("div");
    div.className = className;
    div.innerText = text;
    document.getElementById("chat-messages").appendChild(div);
    document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;
  }
})();

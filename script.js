const chatInput = document.querySelector(".chat-input textarea");
const sendChatbotBtn = document.querySelector(".chat-input span");
const chatbox =document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");



let userMessage;
const API_KEY= "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";
const inputInitHeight = chatInput.scrollHeight;
    const createChatLi = (message,className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat",className);
        let chatContent = className === "outgoing" ? `<p>${message}</p>`  : `  <span class="material-symbols-outlined">smart_toy</span> <p>${message}</p>`;
        
        chatLi.innerHTML = chatContent;
        return chatLi;
    }

    const generateResponse = (incomingChatLi) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const messageElement = incomingChatLi.querySelector("p");

        const requestOptions = { 
            method: "POST",
            headers:{
                "Content-Type" : "Application/json",
                "Authorization" : `Bearer ${API_KEY}`
            },
            body: JSON.stringify ({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage }]
            })

        }

        fetch(API_URL, requestOptions).then(res => res.json()).then( data => {
            console.log(data);
            messageElement.textContent = data.choices[1].message.content;
        }).catch((error)=>{
            messageElement.classList.add("error");
            console.log(error);
            messageElement.textContent = "Oops! Something went wrong try again.";
        }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
    }

    
const handleChat = () => {
    userMessage = chatInput.value.trim();   
    if(!userMessage)return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight} px`;



    createChatLi(userMessage, "outgoing");

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi =createChatLi("Thinking....", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);


} 

chatInput.addEventListener("input",() => {
    chatInput.style.height = `${inputInitHeight} px`;
    chatInput.style.height = `${chatInput.scrollHeight} px`;

})

chatInput.addEventListener("keydown",(e) => {
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

sendChatbotBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));          


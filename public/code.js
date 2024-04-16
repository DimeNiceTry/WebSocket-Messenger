(function(){
    const app = document.querySelector(".app"); //достали элемент с классом "app"
    const socket = io(); // инициировали метод io, обозначенный в server.js

    let uname;
    /* обработка событий */
    app.querySelector(".join-screen #username").addEventListener('keypress', function(e){ // На форме регистрации при нажатии Enter
        if (e.key === 'Enter'){
            let username = app.querySelector(".join-screen #username").value;
            if(username.length === 0){
                return;
            }
            socket.emit("newuser", username); // вызов метода io с параметрами
            uname = username;
            app.querySelector(".join-screen").classList.remove("active");
            app.querySelector(".chat-screen").classList.add("active"); 
        }
    });
    app.querySelector(".join-screen #join-user").addEventListener("click", function(){ // На форме регистрации при нажатии button
        let username = app.querySelector(".join-screen #username").value;
        if(username.length  === 0){
            return;
        }
        console.log(username);
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #message-input").addEventListener('keypress', function(e){ // На форме мессенджера при нажатии Enter
        if (e.key === 'Enter'){
            let message = app.querySelector(".chat-screen #message-input").value;
            if (message.length ===0){
                return;
            }
            renderMessage("my", {
                username:uname,
                text:message
            });
            socket.emit("chat", {
                username:uname,
                text: message
            });
            app.querySelector(".chat-screen #message-input").value = "";
        }
        
    });

    app.querySelector(".chat-screen #send-message").addEventListener('click', function(){ // На форме мессенджера при нажатии Send
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0){
            return;
        }
        renderMessage("my", { //вызов функции renderMessage,описанной ниже
            username:uname,
            text:message
        });
        socket.emit("chat", {
            username:uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });


    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){ // На форме мессенджера при нажатии Exit
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    })

    socket.on("chat", function(message){
        renderMessage("other", message);
    })

    function renderMessage(type,message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type ==="my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }
        else if (type === "other"){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }
        else if (type ==="update"){
            let el = document.createElement("div");
            el.setAttribute("class","update");
            el.innerHTML = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    //опеределение форм
    let regForm = app.querySelector('#enterRegistration');
    let withoutForm = app.querySelector('#enterWithoutLog');
    let logForm = app.querySelector('#enterLogin');
    //определение ссылок
    let regLink = app.querySelector('#registration');
    let logLink = app.querySelector('#login');
    let backRegLink = app.querySelector('#backReg');
    let backLogLink = app.querySelector('#backLog')

    //Ссылки регистрации

    regLink.addEventListener('mouseover', function(){
        regLink.style.cursor = "pointer";
    });
    backRegLink.addEventListener('mouseover',function(){
        backRegLink.style.cursor = "pointer";
    });
    regLink.addEventListener('click', function(){
        withoutForm.classList.add('unactive');
        regForm.classList.remove('unactive');
    });
    backRegLink.addEventListener('click', function(){
        withoutForm.classList.remove('unactive');
        regForm.classList.add('unactive');
    });

    //Ссылки логина

    logLink.addEventListener('mouseover', function(){
        logLink.style.cursor = "pointer";
    });
    backLogLink.addEventListener('mouseover',function(){
        backLogLink.style.cursor = "pointer";
    });
    logLink.addEventListener('click', function(){
        withoutForm.classList.add('unactive');
        logForm.classList.remove('unactive');
    });
    backLogLink.addEventListener('click', function(){
        withoutForm.classList.remove('unactive');
        logForm.classList.add('unactive');
    });
})();
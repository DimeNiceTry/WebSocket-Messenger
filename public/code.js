(function(){
    const app = document.querySelector(".app"); //достали элемент с классом "app"
    const socket = io(); // инициировали метод io, обозначенный в server.js

    let uname;
    /* обработка событий */

    document.addEventListener('DOMContentLoaded', function(){
        savedUname = localStorage.getItem('activeUsername')
        if (savedUname){
            uname = savedUname;
            socket.emit('showMessages', uname);
            app.querySelector(".join-screen").classList.remove("active");
            app.querySelector(".chat-screen").classList.add("active");
            app.querySelector('#uname').textContent = uname;
        }
        else{
            app.querySelector(".join-screen").classList.add("active");
            app.querySelector(".chat-screen").classList.remove("active");
        }
        
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
        localStorage.removeItem('activeUsername');
        socket.emit("exituser", uname);
        socket.emit('addMessage', {value: `${uname} Left the conversation`, uname: uname, type: 'enter'});
        window.location.href = window.location.href;
    });

    socket.on("update", function(update){
        renderMessage("update", update);
        
    });
    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    socket.on('printMyMess', function(data){
        const {value, uname, type} = data;
        
        renderMessage('preMy', data)
    });
    socket.on('printOtherMess', function(data){
        renderMessage('preOther', data)
    });
    socket.on('printUpdateMess', function(data){
        const {value, uname, type} = data;
        renderMessage('update', data.message)
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type === 'preMy'){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.message}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }
        if (type === 'preOther'){
            let el = document.createElement("div");
            el.setAttribute("class","message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.userfrom}</div>
                <div class="text">${message.message}</div>
            </div>
            `;
            messageContainer.appendChild(el);
        }
        if (type ==="my"){
            let el = document.createElement("div");
            el.setAttribute("class","message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="text">${message.text}</div>
            </div>
            `;
            console.log(message);
            socket.emit('addMessage', {value: message.text, uname: message.username, type: 'messages'})
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
console
    //опеределение форм
    let regForm = app.querySelector('#enterRegistration');
    let withoutForm = app.querySelector('#enterWithoutLog');
    let logForm = app.querySelector('#enterLogin');
    //определение ссылок
    let regLink = app.querySelector('#registration');
    let logLink = app.querySelector('#login');
    let backRegLink = app.querySelector('#backReg');
    let backLogLink = app.querySelector('#backLog')
    
    //input-формы

    let logInputLog = app.querySelector('#usernameLog').value;
    let logInputPass = app.querySelector('#passwordLog').value;
    //кнопки подключения

    let regButton = app.querySelector('#reg-user');
    let logButton = app.querySelector('#log-user');
    let incorrectflag = app.querySelector('#incorrect');
    let incorrectflagReg = app.querySelector('#incorrectReg');
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

    regButton.addEventListener('click', function(){
    
        const username = app.querySelector('#usernameReg').value
        const password = app.querySelector('#passwordReg').value
        if (username.length === 0 || password.length === 0){
            incorrectflagReg.textContent = 'Заполните поля!';
            return;
        }
        else{
            socket.emit('addUser', {username: username, password: password});
        }
       
    })
    socket.on('successReg', function(data){
        const username = data;
        localStorage.setItem(`activeUsername`, username);
        
        socket.emit('addMessage', {value: `${username} Joined the conversation`, uname: username, type: 'enter'});
        socket.emit('showMessages', username);
        app.querySelector('#uname').textContent = username;
        if(username.length  === 0){
            return;
        }
        socket.emit("newuser", username);
        uname = app.querySelector('#usernameReg').value;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    })
    socket.on('declinedReg', function(data){
        incorrectflagReg.textContent = 'Такой логин уже существует!';  
    })
    socket.on('success', function(data){

        const username = data;
        socket.emit('addMessage', {value: `${username} Joined the conversation`, uname: username, type: 'enter'});
        localStorage.setItem(`activeUsername`, username);
        socket.emit('showMessages', username);
        app.querySelector('#uname').textContent = username;
        socket.emit("newuser", username);
        
        if(username.length  === 0){
            return;
        }

        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");

    });
    socket.on('decline', function(data){
        incorrectflag.textContent = 'Неправильный логин или пароль';        
    });
    logButton.addEventListener('click', function(){
        const username = app.querySelector('#usernameLog').value;
        const password = app.querySelector('#passwordLog').value;
        if (username.length === 0 || password.length === 0){
            incorrectflag.textContent = 'Заполните поля!';
        }
        else{
            socket.emit('logUser', {username: app.querySelector('#usernameLog').value, password:app.querySelector('#passwordLog').value});
        }
    })


})();
/* Запуск сервера и импортирование нужных библиотек */
const express = require("express"); // Импортируем фреймвор Express
const path = require("path"); //Импорт path для работы с файловой системой

const app = express(); //вызов express, создаёт экземпляр приложения
const server = require("http").createServer(app);   // создание http сервера, используя экземпляр app   

const io = require("socket.io")(server);    // импорт socket.io
const lox = require("socket.io")(server);
app.use(express.static(path.join(__dirname+"/public")));
/* express.static - обработка статических файлов из директории, указанной в аргументе
Path.join - метод создание пути до директории. В него входит dirname - переменная, содержащая по умолчанию абсолютный путь к директории 
и public, указывающий на директорию public. */
lox.on('connection', function(){
    
});
io.on("connection", function(socket){ //метод "Прослушивания" события подключения к серверу. Всего в приложении 3 таких события: подключение или нового пользователя и отправка сообщений

    socket.on("newuser", function(username){ //событие нового пользователя
        socket.broadcast.emit("update", username+" Joined the conversation"); 
    })
    socket.on("exituser", function(username){ //событие выхода пользователя
        socket.broadcast.emit("update", username+" Left the conversation");
    })
    socket.on("chat", function(message){ //событие написания сообщения в чат
        socket.broadcast.emit("chat", message);
    })
    //broadcast.emit - отправка сообщения всем пользователям находящимся в сессии
});

server.listen(5000); //запуск сервера на порту 5000.   
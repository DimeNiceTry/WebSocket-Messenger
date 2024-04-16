const express = require("express"); // Импортируем фреймвор Express
const path = require("path"); //Импорт path для работы с файловой системой

const app = express(); //вызов express, создаёт экземпляр приложения
const server = require("http").createServer(app);   // создание http сервера, используя экземпляр app   

const io = require("socket.io")(server);    

app.use(express.static(path.join(__dirname+"/public")));
/* express.static - обработка статических файлов из директории, указанной в аргументе
Path.join - метод создание пути до директории. В него входит dirname - переменная, содержащая по умолчанию абсолютный путь к директории 
и public, указывающий на директорию public. */
io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username+" Joined the conversation");
    })
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username+" Left the conversation");
    })
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    })
});

server.listen(5000); //запуск сервера на порту 5000.   
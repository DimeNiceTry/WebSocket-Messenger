/* Запуск сервера и импортирование нужных библиотек */
const express = require("express"); // Импортируем фреймворк Express
const path = require("path"); //Импорт path для работы с файловой системой

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const {Pool} = require('pg');   //импорт pg для работы с базами данных типа Postgres

let pool = new Pool({
    connectionString: //There is your connection string dude
});

pool.query('SELECT NOW()', (err, res) => { 
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Connected to Aiven PostgreSQL');
    }
}); //само подключение




const app = express(); //вызов express, создаёт экземпляр приложения
const server = require("http").createServer(app);   // создание http сервера, используя экземпляр app   

const io = require("socket.io")(server);    // импорт socket.io

app.use(express.static(path.join(__dirname+"/public")));
/* express.static - обработка статических файлов из директории, указанной в аргументе
Path.join - метод создание пути до директории. В него входит dirname - переменная, содержащая по умолчанию абсолютный путь к директории 
и public, указывающий на директорию public. */

io.on("connection", function(socket){ //метод "Прослушивания" события подключения к серверу. Всего в приложении 3 таких события: подключение или нового пользователя и отправка сообщений
    
    socket.on('addMessage', function(data){
        const {value, uname, type} = data; // получение данных из функции
        const a = data;
        console.log(a);
        pool.query(`INSERT INTO messages (message, userfrom, type) VALUES ($1, $2, $3)`, [value, uname, type], (err, res) =>{
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                console.log('Message added to the database');
                
            }
            
        })
    });

    socket.on('showMessages', function(username){
        
        pool.query(`SELECT * FROM messages`, (err, res) => { //выполняем запрос в бд с фильтром, где логин берется из переменной
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                res.rows.forEach(message => {
                    if (message.userfrom === username && message.type === 'messages'){
                        socket.emit ('printMyMess', message);
                    }
                    else if (message.userfrom != username && message.type === 'messages'){
                        socket.emit ('printOtherMess', message);
                    }
                    else{
                        socket.emit('printUpdateMess', message);
                    }
                })
                
            }
        })
        
    });


    socket.on("addUser", function(data){ //событие регитрации пользователя

        const {username, password} = data; // получение данных из функции

        pool.query(`INSERT INTO users (login, password) VALUES ($1, $2)`, [username, password], (err, res) => { //выполняем запрос в базу данных
            /* вставляем в базу данных users значения username и password */
            if (err) { //если выдает ошибку, то пробуем залогиниться за пользователя
                try{
                    const result = pool.query(`SELECT password FROM users WHERE login = $1`, [username], (err, res) => {
                        if (err) {
                            console.log(err[0]);
                            socket.emit('declinedReg', username);
                        } else {
                            console.log('Message added to the database');
                            try{
                                
                                if (password == res.rows[0].password){
                                    sucFlag = true;
                                    socket.emit('successReg',username);
                                }
                            } catch{socket.emit('declinedReg', username);}
            
                        }
                        });

                } catch{socket.emit('declinedReg', username);}
                socket.emit('declinedReg', username); //если не получилось зайти за пользователя - вызываем declineReg - отказ регистрации
                console.error('Error executing query', err.stack);

            } else {
                console.log('Message added to the database');
                socket.emit('successReg',username); //если ошибок нет - вызываем successReg - регистрация пользователя
                socket.broadcast.emit("successReg", {username:username}); //также вызываем successReg у всех пользователей
            }
            });
            
    })
    socket.on("logUser", function(data){ //событие логина пользователя

        const {username, password} = data; 

        const result = pool.query(`SELECT password FROM users WHERE login = $1`, [username], (err, res) => { //выполняем запрос в бд с фильтром, где логин берется из переменной
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                console.log('Message added to the database');
                try{ //если существует запись
                    // res.rows - массив с объектами, в котором находятся пароли пользователей

                    if (password == res.rows[0].password){ //берем элемент rows[0].password - пароль данного пользователя
                    //если парль правильный, вызываем success
                        socket.emit('success',username);
                    }
                    else{
                        //вызываем decline
                        socket.emit('decline',username);
                    }
                } catch{socket.emit('decline',username)}

            }
            });
        
    })
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

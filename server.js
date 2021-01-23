const express=require('express')
const app=express()
const path=require('path')

const server=require('http').createServer(app)
const io=require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

app.set('views',path.join(__dirname,'public'))
// Use esse método para engines não fornecidas ou usar uma extensao diferente 
// Para arquivos HTML irá chamar a função ejs.renderFile, para renderizá-los
app.engine('html',require('ejs').renderFile)
// Aviso ao express qual template irei usar, o template irá se responsabilizar por arquivos .html
app.set('view engine','html')


app.use('/',(req,res)=>{
    res.render('index.html')
})

let messages=[]
// Quando conectar ao socket irá realizar determinadas ações
io.on('connection',socket=>{
    console.log('SOCKET CONECTADO =',socket.id)

    socket.emit('previousMessage',messages)

    socket.on('sendMessage',data=>{
        messages.push(data)
        // Irá emitir para todos as portas conectadas
        socket.broadcast.emit('receivedMessage',data)
    })
})


server.listen(3000)

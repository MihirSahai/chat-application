const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMsg, generateLocation} = require('./utils/messages')

const app = express()
const server = http.createServer(app)  //for using socket.io
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname,'../public')
const port = 3000 || process.env.port

app.use(express.static(publicDirectoryPath))

let count = 0;

io.on('connection', (socket)=>{
    console.log('New WebSocket Connection')

    socket.emit('message',generateMsg('Welcome!'))
    socket.broadcast.emit('message',generateMsg('A new user has joined!'))
    
    socket.on('sendMessage',(msg, callback)=>{
      const filter = new Filter()

      if(filter.isProfane(msg)){
          return callback('Profanity is not allowed!')
      }

      io.emit('message',generateMsg(msg))
      callback()
    })
    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location Shared!')
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMsg('A user has left!'))
    })
})

server.listen(port, ()=>{
    console.log(`Server up on port ${port}`);
})
const socket = io()
//Elements
const $messageform = document.querySelector('#message-form')
const $messageformInput = $messageform.querySelector('input')
const $messageformButton = $messageform.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message',(message)=>{ 
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(res)=>{
    console.log(res.url);
    const html = Mustache.render((locationTemplate),{
        url: res.url,
        createdAt: moment(res.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageformButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageformButton.removeAttribute('disabled')   
        $messageformInput.value = ''
        $messageformInput.focus()

        if(error){
            return console.log(error);
        }
        console.log("Message Delivered")
    })
})

$sendLocationButton.addEventListener('click',()=>{

    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser.')
    }
    
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },(msg)=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log(msg);
        })
    })
})

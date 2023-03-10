const io = require('socket.io')(8900, {
    cors: {
        origin: "https://www.quickshare.giftto.online"
    },
});

let users = []

const adduser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    //when connect
    console.log('a user conneccted');
    //take userId and socketId from user
    socket.on("addUser", userId => {
        adduser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user=getUser(receiverId)
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            text
        })
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log('a user discoonected');
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})

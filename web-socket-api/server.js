const { WebSocketServer } = require('ws')

const ws = new WebSocketServer({ port: 8080 })

const users = []

ws.on('connection', (webSocket) => {
  webSocket.onopen = () => {
    console.log('online')
  }
  webSocket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data)
    if (parsedData.eventType == 'NewUser') {
      if (
        users.findIndex((user) => user.fullName === parsedData.fullName) == -1
      ) {
        users.push(parsedData)
        ws.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              data: {
                eventType: 'NewUser',
                userName: parsedData.fullName,
                joinedTime: new Date(),
              },
            })
          )
        })
      }
    } else if (parsedData.eventType === 'NewMessage') {
      ws.clients.forEach((client) => {
        client.send(event.data)
      })
    }
  }

  webSocket.onclose = () => {
    console.log('offline')
  }
})

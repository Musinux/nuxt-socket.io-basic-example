<template>
  <div>
    <h1>{{ title }}</h1>
    <input v-model="message" placeholder="Message">
    <div>
      <button @click="sendMessage">
        Emit Message
      </button>
    </div>
    <ul>
      <li v-for="msg in messages" :key="msg.message">
        <pre v-text="msg.message" />
      </li>
    </ul>
  </div>
</template>

<script>
import io from 'socket.io-client'
let socket
export default {
  data: () => ({
    title: 'Chat Nuxt App',
    message: '',
    messages: []
  }),
  mounted () {
    socket = io('http://localhost:3000')
    console.log('socket', socket)
    socket.on('chat-message', msg => this.onMessage(msg))
  },
  methods: {
    onMessage (msg) {
      console.log('msg', msg)
      this.messages.push(msg)
    },
    sendMessage () {
      socket.emit('chat-message', { message: this.message })
      console.log('sendMessage:', this.message, socket.id)
      this.message = ''
    }
  }
}
</script>

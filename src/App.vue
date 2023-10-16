<script setup>

import {nextTick, ref} from "vue";
import {addMessage, getMessages} from "@/messages";

const user = ref(null)
const messages = ref([])
const scrollRef = ref(null)
const inputMessage = ref('')

const loadMessages = (id = null) => {
  if (id === null) {
    return getMessages()
        .then((rows) => {
          messages.value = rows.reverse()
          return rows.length
        })
  } else {
    return getMessages(id)
        .then((rows) => {
          messages.value = rows.reverse().concat(messages.value)
          return rows.length
        })
  }
}

const handleScroll = (e) => {
  let element = e.target

  if (element.scrollTop < 10) {
    let first = messages.value[0]
    console.log('loading...' + first.id)
    loadMessages(first.id)
        .then((size) => {
          if (size !== 0) {
            element.scrollTo({top: 50})
          }
        })
  }
}

const sendMessage = () => {
  if (inputMessage.value !== '') {
    addMessage(user.value, inputMessage.value)
        .then(() => inputMessage.value = '')
  }
}

new BroadcastChannel('chat-data').onmessage = (msg) => {
  messages.value.push(msg.data)
  nextTick(() => {
    scrollRef.value &&
    scrollRef.value.scrollTo(0, scrollRef.value.scrollHeight)
  })
}

const login = (e) => {
  user.value = e.target.value
  loadMessages()
      .then(() => {
        scrollRef.value.scrollTo(0, scrollRef.value.scrollHeight)
      })
}
</script>

<template>
  <div v-if="user === null"
       class="content-center">
    <div
        class="flex flex-col justify-between min-w-max mx-auto my-3
        block p-6 bg-white border border-gray-200 rounded-lg shadow w-[500px]">
      <div class="mb-6">
        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Enter Username and Press Enter
        </label>
        <input type="text" id="username" placeholder="Enter user name" @keydown.enter="login"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center align-center h-screen">
    <div class="flex flex-col  h-auto justify-between min-w-max mx-auto my-3
  block p-6 bg-white border border-gray-200 rounded-lg shadow w-[500px]">

      <h4 class="text-3xl text-gray-900 mb-4 text-center">{{ user }}</h4>

      <div @scroll="handleScroll" ref="scrollRef"
           class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue w-full
          scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">

        <div v-for="message in messages">
            <span class="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
              <span class="font-bold font-italic">{{ message.id }} - {{ message.name }}</span>
                {{ message.content }}
            </span>
        </div>

      </div>

      <div class="border-t-2 border-gray-200 pt-4 mt-2">
        <form @submit.prevent="sendMessage"
              class="flex gap-x-1">
          <input type="text" placeholder="Write your message"
                 v-model="inputMessage"
                 autofocus
                 class="w-full focus:outline-none focus:placeholder-gray-400
                  text-gray-600 placeholder-gray-600 bg-gray-200 rounded-md px-2">
          <button type="submit"
                  class="inline-flex items-center justify-center rounded-lg px-4 py-3
              transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
            <span class="font-bold">Send</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                 class="h-6 w-6 ml-2 transform rotate-90">
              <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

/**
 * main.js — Application Entry Point
 *
 * WHY: This is where Vue, Pinia (state), and Vue Router (navigation)
 * are all wired together and mounted to the #app div in index.html.
 *
 * Order matters:
 * 1. Create the app
 * 2. Register Pinia (state must be available before router guards run)
 * 3. Register the Router
 * 4. Mount to DOM
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia()) // State management
app.use(router)        // Client-side routing

app.mount('#app')
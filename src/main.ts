import { createApp } from 'vue'
import '@progress/kendo-theme-bootstrap/dist/all.css'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(VueAxios, axios)
app.mount('#app')

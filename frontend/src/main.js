import { createApp } from 'vue'
import { Quasar, Dialog, Notify } from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Notify
  },
  config: {
    dark: 'auto'
  }
})

myApp.mount('#app')

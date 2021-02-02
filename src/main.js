import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "toastr/build/toastr.min.css"
import "toastr/build/toastr.min"
import VueCookies from "vue-cookies";



createApp(App).use(router).use(VueCookies).mount('#app')

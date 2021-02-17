import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "toastr/build/toastr.min.css"
import "toastr/build/toastr.min"
import store from './store'




const app = createApp(App).use(store).use(router).mount('#app')
app.echarts = echarts


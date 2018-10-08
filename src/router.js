import Vue from 'vue'
import Router from 'vue-router'
import secretShow from './views/secretShow'
import secretRecover from './views/secretRecover'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'show',
      component: secretShow
    },
    {
        path: '/recover',
        name: 'recover',
        component: secretRecover
    }
  ]
})

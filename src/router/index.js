import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import password from '@/pages/password'
import phone from '@/pages/phone'
import register from '@/pages/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/password',
      name: 'password',
      component: password
    },
    {
      path: '/phone',
      name: 'phone',
      component: phone
    },
    {
      path: '/register',
      name: 'register',
      component: register
    }
  ]
})

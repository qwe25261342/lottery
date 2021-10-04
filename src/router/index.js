import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Lottery from '../views/Lottery.vue'
import Record from '../views/Record.vue'

Vue.use(VueRouter)

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Register',
      component: Register
    },
    {
      path: '/lottery',
      name: 'Lottery',
      component: Lottery
    },
    {
      path: '/record',
      name: 'Record',
      component: Record
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.require) {
//     if (localStorage.getItem("token") == null) {
//       alert("請登入");
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath}  
//       })
//     }
//   }
//   next()
// })

export default router

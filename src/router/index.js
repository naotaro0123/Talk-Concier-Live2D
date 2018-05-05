import Vue from 'vue'
import Router from 'vue-router'
import SplashPage from '@/pages/SplashPage'
import MenuPage from '@/pages/MenuPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SplashPage',
      component: SplashPage
    },
    {
      path: '/menu',
      name: 'MenuPage',
      component: MenuPage
    }
  ]
})

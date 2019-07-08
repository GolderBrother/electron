import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const requireComponent = file => require(`@/components/${file}`).default

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: requireComponent("Home") 
    },
    {
      path: '/report',
      name: 'report',
      component: requireComponent("Report") 
    },
    {
      path: '/negativereport',
      name: 'negativereport',
      component: requireComponent("NegativeReport") 
    },
    {
      path: '/positivereport',
      name: 'positivereport',
      component: requireComponent("PositiveReport") 
    },
    {
      path: '/keyword',
      name: 'keyword',
      component: requireComponent("KeyWord") 
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: requireComponent("Alarm") 
    },
    {
      path: '/msg',
      name: 'msg',
      component: requireComponent("Msg") 
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

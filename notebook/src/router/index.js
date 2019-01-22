import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Notebook from '@/components/Notebook'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'Notebook',
      component: Notebook
    },
    {
      path: '/:note',
      name: 'Notebook',
      component: Notebook
    }
  ]
})

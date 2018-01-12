import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SearchProfesori from '@/components/SearchProfesori'
import AddProfesor from '@/components/AddProfesor'
import ProfesorProfile from '@/components/ProfesorProfile'
import Login from '@/components/Login'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/profesori/search',
      name: 'Search Profesori',
      component: SearchProfesori
    },
    {
      path: '/profesori/add',
      name: 'Add Profesor',
      component: AddProfesor
    },
    {
      path: '/profesori/profile',
      name: 'Profile',
      component: ProfesorProfile
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

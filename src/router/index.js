import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import signup from '../views/signup'
import groups from '../views/groupList'
import store from '@/store'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login/',
    name: 'login',
    component: login,
    meta: { requiresAuth: false, title: 'Skej | Login' }
  },
  {
    path: '/register',
    name: 'signUp',
    component: signup,
    meta: { requiresAuth: false, title: 'Skej | Sign Up' }
  },
  {
    path: '/forgot',
    name: 'forgotPassword',
    component: () => import('../views/forgotPassword'),
    meta: { requiresAuth: false, title: 'Skej | Reset Password' }
  },
  {
    path: '',
    name: 'dash',
    components: {
      default: () => import('../views/dashboard'),
      sidenav: () => import('../components/dash/sidenav')
    },
    meta: { requiresAuth: true, title: 'Skej' },
    children: [
      {
        path: '/calendar',
        name: 'calendar',
        component: () => import('../components/dash/calendar'),
        meta: { requiresAuth: true, title: 'Skej | My Calendar' }
      },
      {
        path: '/week_calendar',
        name: 'week_calendar',
        component: () => import('../components/dash/weekCalendar'),
        meta: { requiresAuth: true, title: 'Skej | My Calendar' }
      },
      {
        path: '/groups',
        name: 'groups',
        component: groups,
        meta: { requiresAuth: true, title: 'Skej | Groups' }
      },
      {
        path: '/today',
        name: 'today',
        component: () => import('../views/yourDay'),
        meta: { requiresAuth: true, title: 'Skej | My Day, Today' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../components/dash/settings'),
        meta: { requiresAuth: true, title: 'Skej | Settings' }
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('../components/dash/account'),
        meta: { requiresAuth: true, title: 'Skej | Account Settings' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../components/dash/profile'),
        meta: { requiresAuth: true, title: 'Skej | Profile Settings' }
      },
      {
        path: 'calendar_settings',
        name: 'calendar_settings',
        component: () => import('../components/dash/calendar_settings'),
        meta: { requiresAuth: true, title: 'Skej | Calendar Settings' }
      },
      {
        path: 'integration_settings',
        name: 'integration_settings',
        component: () => import('../components/dash/integrations'),
        meta: { requiresAuth: true, title: 'Skej | Integration Settings' }
      },
      {
        path: 'company',
        name: 'company',
        component: () => import('../components/dash/company'),
        meta: { requiresAuth: true, title: 'Skej | Company Settings' }
      }
    ]
  },
  {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: () => import('../views/legal/privacy_policy'),
    meta: { requiresAuth: false, title: 'Skej | Privacy Policy' }
  },
  {
    path: '/*',
    name: '404',
    component: () => import('../views/404'),
    meta: { requiresAuth: false, title: 'Skej | 404 - Page Not Found' }
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters['auth/authenticated']) {
    // If the requested route requires authentication and there is no auth cookie then redirect to login:
    next({ name: 'login', params: { lang: to.params.lang }, query: { dest: to.fullPath } })
  } else if (!to.meta.requiresAuth && store.getters['auth/authenticated']) {
    // If the requested route doesnt require authentication, but the client is authenticated:
    if (['privacyPolicy', '404'].includes(to.name)) next() // If the requested route is one of these, continue
    if (from.name !== null) {
      // eslint-disable-next-line no-undef
      NProgress.done()
      next(from)
    } else {
      next({ name: 'dash', params: { lang: to.params.lang } })
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  // eslint-disable-next-line no-undef
  NProgress.done()
})

export default router

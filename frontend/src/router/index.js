import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

// import middlewares
import middlewarePipeline from './middlewarePipeline'
import checkAuth from './middleware/checkAuth.js'
// import setLocale from './middleware/getLocale.js'
// import getUserData from './middleware/getUserData.js'

// import views components
import Home from '../views/Home.vue'

Vue.use(VueRouter)

// listing routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * AUTHENTICATION
   */
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/auth/Login.vue')
  },
  {
    path: '/reset-auth-api-client',
    name: 'ResetAuthApiCli',
    component: () => import(/* webpackChunkName: "resetAuth" */ '../views/auth/ResetAuthApiCli.vue')
  },
  {
    path: '/oauth-client-id',
    name: 'AuthorizeClientId',
    component: () => import(/* webpackChunkName: "authorize" */ '../views/auth/AuthorizeClientId.vue')
  },
  // {
  //   path: '/set-api-key',
  //   name: 'SetApiKey',
  //   component: () => import(/* webpackChunkName: "setApiKey" */ '../views/auth/SetApiKey.vue'),
  //   meta: {
  //     middleware: [
  //       checkAuth
  //     ]
  //   }
  // },
  {
    path: '/get-user-data',
    name: 'GetUserData',
    component: () => import(/* webpackChunkName: "getUserData" */ '../views/auth/GetUserData.vue')
  },
  /***************************
   * SETTINGS
   */
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/settings/Settings.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/settings/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/settings/Profile.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * DATASETS
   */
  {
    path: '/datasets',
    name: 'Datasets',
    component: () => import(/* webpackChunkName: "datasets" */ '../views/datasets/Datasets.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/datasets/:id',
    name: 'DatasetUpdate',
    component: () => import(/* webpackChunkName: "dataset" */ '../views/datasets/DatasetUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * RESOURCES
   */
  // {
  //   path: '/resources',
  //   name: 'Resources',
  //   component: () => import(/* webpackChunkName: "resources" */ '../views/resources/Resources.vue'),
  //   meta: {
  //     middleware: [
  //       checkAuth
  //     ]
  //   }
  // },
  {
    path: '/resources-community',
    name: 'ResourcesCommunity',
    component: () => import(/* webpackChunkName: "resourcesCommunity" */ '../views/resources/ResourcesCommunity.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/resources-community/:id',
    name: 'ResourceCommunityUpdate',
    component: () => import(/* webpackChunkName: "resource" */ '../views/resources/ResourceCommunityUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * REUSES
   */
  {
    path: '/reuses',
    name: 'Reuses',
    component: () => import(/* webpackChunkName: "reuses" */ '../views/reuses/Reuses.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/reuses/:id',
    name: 'ReuseUpdate',
    component: () => import(/* webpackChunkName: "reuse" */ '../views/reuses/ReuseUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * USERS
   */
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "users" */ '../views/users/Users.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/users/:id',
    name: 'UserUpdate',
    component: () => import(/* webpackChunkName: "user" */ '../views/users/UserUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * ORGANIZATIONS
   */
  {
    path: '/organizations',
    name: 'Organizations',
    component: () => import(/* webpackChunkName: "organizations" */ '../views/organizations/Organizations.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/organizations/:id',
    name: 'OrganizationUpdate',
    component: () => import(/* webpackChunkName: "organization" */ '../views/organizations/OrganizationUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * ISSUES
   */
  {
    path: '/issues',
    name: 'Issues',
    component: () => import(/* webpackChunkName: "issues" */ '../views/issues/Issues.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/issues/:id',
    name: 'IssueUpdate',
    component: () => import(/* webpackChunkName: "issue" */ '../views/issues/IssueUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  /***************************
   * DISCUSSIONS
   */
  {
    path: '/discussions',
    name: 'Discussions',
    component: () => import(/* webpackChunkName: "discussions" */ '../views/discussions/Discussions.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  },
  {
    path: '/discussions/:id',
    name: 'DiscussionUpdate',
    component: () => import(/* webpackChunkName: "discussion" */ '../views/discussions/DiscussionUpdate.vue'),
    meta: {
      middleware: [
        checkAuth
      ]
    }
  }
]

// building routes
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

// custom history
router.beforeEach((to, from, next) => {
  const skippableRoutes = [
    '/login',
    '/reset-auth-api-client',
    '/auth-client-id',
    '/get-user-data'
  ]
  if (!skippableRoutes.includes(from.path)) {
    store.commit('global/appendPathToHistory', from.fullPath)
  }
  next()
})

// adding middleware ability
// cf : https://blog.logrocket.com/vue-middleware-pipelines/
// inspired from : https://github.com/Dotunj/vue-middleware-pipelines/blob/master/src/router/router.js
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware]
  const context = {
    to,
    from,
    next,
    router,
    store
  }
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

export default router

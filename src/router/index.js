import { createRouter, createWebHistory } from 'vue-router'

const RegisterView = () => import('@/views/RegisterView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const WorkoutsView = () => import('@/views/WorkoutsView.vue')
const AddWorkoutView = () => import('@/views/AddWorkoutView.vue')

const routes = [
  // Redirect root to workouts; guard will redirect to login if not authed
  {
    path: '/',
    redirect: '/workouts'
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true } // Logged-in users shouldn't see this
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } // Logged-in users shouldn't see this
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: WorkoutsView,
    meta: { requiresAuth: true } // Must be logged in
  },
  {
    path: '/addWorkouts',
    name: 'AddWorkouts',
    component: AddWorkoutView,
    meta: { requiresAuth: true } // Must be logged in
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ─── Global Navigation Guard ──────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Protected route + no token → redirect to login
    next({ name: 'Login' })
  } else if (to.meta.requiresGuest && isLoggedIn) {
    // Guest route + already logged in → redirect to workouts
    next({ name: 'Workouts' })
  } else {
    // All clear — proceed
    next()
  }
})

export default router
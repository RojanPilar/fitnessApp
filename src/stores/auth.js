import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  // Initialize token from localStorage so page refreshes don't log users out
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  // ─── Getters (Computed) ───────────────────────────────────────────────────
  const isLoggedIn = computed(() => !!token.value)

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Register action
   * Calls POST /users/register — does NOT auto-login (user must login after)
   */
  async function register(email, password) {
    const response = await authService.register(email, password)
    return response.data
  }

  /**
   * Login action
   * Calls POST /users/login → gets token → saves to state + localStorage
   */
  async function login(email, password) {
    const response = await authService.login(email, password)

    // The API returns an object with "access" or "token" — adjust if needed
    const receivedToken = response.data.access || response.data.token
    token.value = receivedToken
    localStorage.setItem('token', receivedToken)

    return response.data
  }

  /**
   * Fetch user details
   * Calls GET /users/details (token auto-attached by interceptor)
   */
  async function fetchUserDetails() {
    const response = await authService.getDetails()
    user.value = response.data
    return response.data
  }

  /**
   * Logout action
   * Clears all auth state and redirects to /login
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    // Router redirect is handled in the component or route guard
    window.location.href = '/login'
  }

  return {
    token,
    user,
    isLoggedIn,
    register,
    login,
    fetchUserDetails,
    logout
  }
})
/**
 * services/authService.js
 *
 * WHY THIS FILE EXISTS:
 * Each service file maps 1-to-1 with an API resource group.
 * This file handles everything under "/users/..." endpoints.
 *
 * API Endpoints used:
 *   POST /users/register  → { email, password }
 *   POST /users/login     → { email, password } → returns { token }
 *   GET  /users/details   → requires Bearer token
 */
import api from './api'

const authService = {
  /**
   * Register a new user
   * Maps to: POST /users/register
   * @param {string} email
   * @param {string} password
   */
  register(email, password) {
    return api.post('/users/register', { email, password })
  },

  /**
   * Login an existing user
   * Maps to: POST /users/login
   * The server returns a JWT token which we store in localStorage.
   * @param {string} email
   * @param {string} password
   */
  login(email, password) {
    return api.post('/users/login', { email, password })
  },

  /**
   * Get the currently logged-in user's details
   * Maps to: GET /users/details  (token is auto-attached by interceptor)
   */
  getDetails() {
    return api.get('/users/details')
  }
}

export default authService
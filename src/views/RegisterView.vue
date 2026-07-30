<template>
  <div class="auth-page">
    <div class="auth-bg-glow auth-bg-glow--mint"></div>
    <div class="auth-bg-glow auth-bg-glow--coral"></div>

    <div class="auth-card card">
      <!-- Header -->
      <div class="auth-header">
        <div class="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h1 class="auth-title">Create account</h1>
        <p class="auth-subtitle">Start tracking your fitness journey</p>
      </div>

      <!-- Alerts -->
      <div v-if="errorMessage" class="alert alert-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ successMessage }}
      </div>

      <!-- Registration Form -->
      <div class="auth-form">
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="you@example.com"
            autocomplete="email"
            @keyup.enter="handleRegister"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Minimum 6 characters"
            autocomplete="new-password"
            @keyup.enter="handleRegister"
          />
          <span class="field-hint">Use at least 6 characters</span>
        </div>

        <button
          class="btn btn-primary submit-btn"
          :disabled="isLoading || !email || !password"
          @click="handleRegister"
        >
          <span v-if="isLoading" class="spinner-inline"></span>
          <span>{{ isLoading ? 'Creating account…' : 'Create account' }}</span>
          <svg v-if="!isLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <!-- Footer -->
      <div class="auth-divider">
        <span>Already have an account?</span>
      </div>
      <p class="auth-footer">
        <RouterLink to="/login" class="auth-footer-link">Sign in instead →</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await auth.register(email.value, password.value)
    successMessage.value = 'Account created! Redirecting to login…'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.auth-bg-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.auth-bg-glow--mint {
  width: 500px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(16, 185, 129, 0.07) 0%, transparent 70%);
  top: -100px;
  left: -100px;
}
.auth-bg-glow--coral {
  width: 400px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(239, 68, 68, 0.05) 0%, transparent 70%);
  bottom: -80px;
  right: -80px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  background: rgba(22, 27, 38, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: cardReveal 0.5s var(--ease) both;
}

@keyframes cardReveal {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  width: 52px;
  height: 52px;
  background: var(--mint-dim);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mint);
  margin: 0 auto 1.25rem;
  box-shadow: var(--shadow-mint);
}

.auth-title {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.35rem;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.field-hint {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.submit-btn {
  margin-top: 0.5rem;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.auth-divider span {
  color: var(--text-tertiary);
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.auth-footer {
  text-align: center;
}

.auth-footer-link {
  color: var(--mint);
  font-size: 0.9rem;
  font-weight: 600;
}
.auth-footer-link:hover { color: var(--mint-hover); }

.spinner-inline {
  animation: spin 0.7s linear infinite;
  border: 2px solid rgba(3, 41, 23, 0.3);
  border-top-color: var(--text-on-mint);
  border-radius: 50%;
  display: inline-block;
  height: 14px;
  width: 14px;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
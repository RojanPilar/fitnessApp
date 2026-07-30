<template>
  <div class="container-fluid px-3 px-md-4 py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

        <!-- ─── Back Link ────────────────────────────────────────────────── -->
        <RouterLink to="/workouts" class="back-link d-inline-flex align-items-center gap-2 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to workouts
        </RouterLink>

        <!-- ─── Form Card ────────────────────────────────────────────────── -->
        <div class="form-card mb-3">
          <!-- Header -->
          <div class="d-flex align-items-center gap-3 mb-0">
            <div class="form-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <p class="form-eyebrow mb-0">New session</p>
              <h1 class="form-title mb-0">Log a workout</h1>
            </div>
          </div>

          <div class="form-divider"></div>

          <!-- Alerts -->
          <div v-if="errorMessage" class="alert alert-error mb-3">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mb-3">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ successMessage }}
          </div>

          <!-- Name field -->
          <div class="field-group mb-3">
            <label class="field-label" for="workout-name">Workout name</label>
            <input
              id="workout-name"
              v-model="name"
              type="text"
              class="field-input"
              placeholder="e.g. Morning Run, Push Day, Yoga"
              maxlength="100"
            />
            <span class="field-hint">Be specific — it helps you spot trends</span>
          </div>

          <!-- Duration field -->
          <div class="field-group mb-4">
            <label class="field-label" for="workout-duration">Duration</label>
            <div class="input-icon-wrap">
              <svg class="input-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <input
                id="workout-duration"
                v-model="duration"
                type="text"
                class="field-input field-input--icon"
                placeholder="e.g. 30 mins, 1 hour"
                maxlength="50"
              />
            </div>
            <span class="field-hint">How long did your session last?</span>
          </div>

          <!-- Submit -->
          <button
            class="btn-submit w-100"
            :disabled="isLoading || !name || !duration"
            @click="handleSubmit"
          >
            <span v-if="isLoading" class="spinner-inline"></span>
            <span>{{ isLoading ? 'Saving…' : 'Log workout' }}</span>
            <svg v-if="!isLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        <!-- ─── Tips Card ─────────────────────────────────────────────────── -->
        <div class="tips-card">
          <div class="tips-header">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Tips for good logging
          </div>
          <ul class="tips-list">
            <li>"Upper Body Strength" beats "Workout" — names you'll recognize later</li>
            <li>Log right after finishing while details are fresh</li>
            <li>Count active recovery days — rest is part of training</li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useWorkoutStore } from '@/stores/workouts'

const router       = useRouter()
const workoutStore = useWorkoutStore()

const name           = ref('')
const duration       = ref('')
const isLoading      = ref(false)
const errorMessage   = ref('')
const successMessage = ref('')

async function handleSubmit() {
  if (!name.value.trim() || !duration.value.trim()) {
    errorMessage.value = 'Both workout name and duration are required.'
    return
  }

  isLoading.value    = true
  errorMessage.value   = ''
  successMessage.value = ''

  try {
    await workoutStore.addWorkout(name.value.trim(), duration.value.trim())
    successMessage.value = 'Workout logged! Redirecting…'
    setTimeout(() => { router.push('/workouts') }, 900)
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to log workout. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ─── Back link ──────────────────────────────────────────────────────────── */
.back-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease), gap var(--dur-fast) var(--ease);
}

.back-link:hover {
  color: var(--mint);
}

/* ─── Form card ──────────────────────────────────────────────────────────── */
.form-card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.6rem;
  box-shadow: var(--shadow-md);
}

.form-header-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  background: var(--mint-dim);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mint);
  box-shadow: var(--shadow-mint);
}

.form-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--mint);
  margin-bottom: 0.2rem;
}

.form-title {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.form-divider {
  height: 1px;
  background: var(--border);
  margin: 1.4rem 0;
}

/* ─── Field group ────────────────────────────────────────────────────────── */
.field-group {
  position: relative;
}

.field-label {
  display: block;
  font-size: 0.73rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.45rem;
}

.field-input {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font);
  font-size: 0.95rem;
  padding: 0.7rem 1rem;
  outline: none;
  transition:
    border-color var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease);
}

.field-input::placeholder {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.field-input:hover {
  border-color: var(--border-bright);
  background: var(--surface-3);
}

.field-input:focus {
  border-color: var(--mint);
  background: var(--surface-2);
  box-shadow: 0 0 0 3px var(--mint-glow);
}

/* Duration field with clock icon */
.input-icon-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  z-index: 1;
  transition: color var(--dur-fast) var(--ease);
}

.field-input--icon {
  padding-left: 2.5rem;
}

.input-icon-wrap:focus-within .input-icon {
  color: var(--mint);
}

.field-hint {
  display: block;
  margin-top: 0.38rem;
  font-size: 0.73rem;
  color: var(--text-tertiary);
  line-height: 1.4;
}

/* ─── Submit button ──────────────────────────────────────────────────────── */
.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  background: var(--mint);
  color: var(--text-on-mint);
  font-family: var(--font);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.82rem 1.5rem;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 12px var(--mint-glow);
  transition:
    background var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}

.btn-submit:hover:not(:disabled) {
  background: var(--mint-hover);
  box-shadow: 0 4px 20px var(--mint-glow);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ─── Tips card ──────────────────────────────────────────────────────────── */
.tips-card {
  background: rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: var(--radius-md);
  padding: 1.1rem 1.2rem;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--mint);
  margin-bottom: 0.8rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tips-list li {
  font-size: 0.835rem;
  color: var(--text-secondary);
  padding-left: 1rem;
  position: relative;
  line-height: 1.55;
}

.tips-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--text-tertiary);
  font-size: 0.78rem;
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
.spinner-inline {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(3, 41, 23, 0.3);
  border-top-color: var(--text-on-mint);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
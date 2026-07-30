<template>
  <!-- ─── Modal Overlay ──────────────────────────────────────────────────── -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-dialog-custom">
      <!-- Header -->
      <div class="modal-header-custom d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center gap-3">
          <div class="modal-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <h2 class="modal-title-custom mb-0">Edit workout</h2>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="alert alert-error mb-3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Fields -->
      <div class="form-group mb-3">
        <label class="form-label-custom" for="edit-name">Workout name</label>
        <input
          id="edit-name"
          v-model="localName"
          type="text"
          class="form-control-custom"
          placeholder="e.g. Morning Run"
          autofocus
        />
      </div>

      <div class="form-group mb-4">
        <label class="form-label-custom" for="edit-duration">Duration</label>
        <input
          id="edit-duration"
          v-model="localDuration"
          type="text"
          class="form-control-custom"
          placeholder="e.g. 45 mins"
        />
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 justify-content-end">
        <button class="btn-ghost-custom" @click="$emit('close')">Cancel</button>
        <button
          class="btn-save-custom"
          :disabled="isLoading || !localName || !localDuration"
          @click="handleSave"
        >
          <span v-if="isLoading" class="spinner-inline"></span>
          <span>{{ isLoading ? 'Saving…' : 'Save changes' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useWorkoutStore } from '@/stores/workouts'

const props = defineProps({
  workout: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const workoutStore = useWorkoutStore()

const localName     = ref(props.workout.name)
const localDuration = ref(props.workout.duration)
const isLoading     = ref(false)
const errorMessage  = ref('')

watch(
  () => props.workout,
  (w) => {
    localName.value     = w.name
    localDuration.value = w.duration
  }
)

async function handleSave() {
  if (!localName.value || !localDuration.value) {
    errorMessage.value = 'Both fields are required.'
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  try {
    await workoutStore.updateWorkout(props.workout._id, localName.value, localDuration.value)
    emit('close')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to update workout.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ─── Overlay ────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Safe padding so dialog never touches screen edges on mobile */
  padding: 1rem;
  background: rgba(7, 10, 18, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100;
  animation: overlayIn var(--dur-mid) var(--ease);
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ─── Dialog ─────────────────────────────────────────────────────────────── */
.modal-dialog-custom {
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-xl);
  /* Let it shrink on small screens, cap at 460px on large */
  width: 100%;
  max-width: 460px;
  /* Use max-height + overflow so content never pushes off-screen */
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 1.75rem;
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  animation: dialogIn var(--dur-slow) var(--ease);
}

@keyframes dialogIn {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
.modal-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: var(--amber-dim);
  border: 1px solid rgba(245, 158, 11, 0.22);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--amber);
}

.modal-title-custom {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.close-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.close-btn:hover {
  background: var(--surface-2);
  color: var(--text-primary);
  border-color: var(--border-bright);
}

/* ─── Form controls ──────────────────────────────────────────────────────── */
.form-label-custom {
  display: block;
  font-size: 0.73rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.45rem;
}

.form-control-custom {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font);
  font-size: 0.95rem;
  padding: 0.72rem 1rem;
  outline: none;
  transition:
    border-color var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    background var(--dur-fast) var(--ease);
}

.form-control-custom::placeholder {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.form-control-custom:hover {
  border-color: var(--border-bright);
  background: var(--surface-3);
}

.form-control-custom:focus {
  border-color: var(--mint);
  background: var(--surface-2);
  box-shadow: 0 0 0 3px var(--mint-glow);
}

/* ─── Action buttons ─────────────────────────────────────────────────────── */
.btn-ghost-custom {
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.btn-ghost-custom:hover {
  background: var(--surface-2);
  color: var(--text-primary);
  border-color: var(--border-bright);
}

.btn-save-custom {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--mint);
  color: var(--text-on-mint);
  cursor: pointer;
  box-shadow: 0 2px 10px var(--mint-glow);
  transition:
    background var(--dur-fast) var(--ease),
    box-shadow var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease);
}

.btn-save-custom:hover:not(:disabled) {
  background: var(--mint-hover);
  box-shadow: 0 4px 16px var(--mint-glow);
  transform: translateY(-1px);
}

.btn-save-custom:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
.spinner-inline {
  display: inline-block;
  width: 13px;
  height: 13px;
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
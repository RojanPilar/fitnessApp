<template>
  <!-- ─── Modal Overlay ───────────────────────────────────────────────────── -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Edit Workout</h2>
        <button class="btn btn-ghost btn-icon" @click="$emit('close')">✕</button>
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

      <!--
        Edit Form
        Maps to: PATCH /workouts/updateWorkout/:id
        Payload: { name, duration }
      -->
      <div class="form-group">
        <label for="edit-name">Workout Name</label>
        <input
          id="edit-name"
          v-model="localName"
          type="text"
          class="form-control"
          placeholder="e.g. Morning Run"
        />
      </div>

      <div class="form-group">
        <label for="edit-duration">Duration</label>
        <input
          id="edit-duration"
          v-model="localDuration"
          type="text"
          class="form-control"
          placeholder="e.g. 45 mins"
        />
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <button class="btn btn-ghost" @click="$emit('close')">Cancel</button>
        <button
          class="btn btn-primary modal-save-btn"
          :disabled="isLoading || !localName || !localDuration"
          @click="handleSave"
        >
          <span v-if="isLoading" class="spinner-inline"></span>
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * EditWorkoutModal.vue  — Stretch Goal
 *
 * Receives the workout to edit as a prop.
 * On save → calls PATCH /workouts/updateWorkout/:id via the store.
 * On success → emits 'close' to hide the modal.
 */
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

// Local copies of the fields (don't mutate props directly)
const localName = ref(props.workout.name)
const localDuration = ref(props.workout.duration)
const isLoading = ref(false)
const errorMessage = ref('')

// Keep local state in sync if the parent swaps the workout prop
watch(
  () => props.workout,
  (newWorkout) => {
    localName.value = newWorkout.name
    localDuration.value = newWorkout.duration
  }
)

// ─── Save Handler ─────────────────────────────────────────────────────────
// Maps to: PATCH /workouts/updateWorkout/:id
async function handleSave() {
  if (!localName.value || !localDuration.value) {
    errorMessage.value = 'Both fields are required.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await workoutStore.updateWorkout(
      props.workout._id,
      localName.value,
      localDuration.value
    )
    emit('close') // Close the modal on success
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || 'Failed to update workout.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-save-btn {
  width: auto;
  padding: 0.65rem 1.5rem;
}

.btn-icon {
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
}

.spinner-inline {
  animation: spin 0.8s linear infinite;
  border: 2px solid rgba(13, 17, 23, 0.3);
  border-top-color: #0d1117;
  border-radius: 50%;
  display: inline-block;
  height: 14px;
  width: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

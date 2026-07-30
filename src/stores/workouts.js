import { defineStore } from 'pinia'
import { ref } from 'vue'
import workoutService from '@/services/workoutService'

export const useWorkoutStore = defineStore('workouts', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const workouts = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Fetch all workouts for the logged-in user
   * Maps to: GET /workouts/getMyWorkouts
   */
  async function fetchWorkouts() {
    isLoading.value = true
    error.value = null
    try {
      const response = await workoutService.getMyWorkouts()
      // API may return array directly or nested — handle both
      workouts.value = Array.isArray(response.data)
        ? response.data
        : response.data.workouts || []
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load workouts.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Add a new workout
   * Maps to: POST /workouts/addWorkout
   */
  async function addWorkout(name, duration) {
    const response = await workoutService.addWorkout(name, duration)
    // Append the new workout to the local list so the UI updates instantly
    const newWorkout = response.data.workout || response.data
    workouts.value.unshift(newWorkout)
    return response.data
  }

  /**
   * Update a workout in place
   * Maps to: PATCH /workouts/updateWorkout/:id
   */
  async function updateWorkout(id, name, duration) {
    const response = await workoutService.updateWorkout(id, name, duration)
    // Find and replace in local array for instant UI update
    const updated = response.data.workout || response.data
    const index = workouts.value.findIndex((w) => w._id === id)
    if (index !== -1) workouts.value[index] = updated
    return response.data
  }

  /**
   * Delete a workout by ID
   * Maps to: DELETE /workouts/deleteWorkout/:id
   */
  async function deleteWorkout(id) {
    await workoutService.deleteWorkout(id)
    // Remove from local array without re-fetching from server
    workouts.value = workouts.value.filter((w) => w._id !== id)
  }

  /**
   * Toggle the completed status of a workout
   * Maps to: PATCH /workouts/completeWorkoutStatus/:id
   */
  async function toggleComplete(id) {
    const response = await workoutService.completeWorkout(id)
    const updated = response.data.workout || response.data
    const index = workouts.value.findIndex((w) => w._id === id)
    if (index !== -1) workouts.value[index] = updated
    return response.data
  }

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    toggleComplete
  }
})
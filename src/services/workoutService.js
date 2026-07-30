import api from './api'

const workoutService = {
  /**
   * Add a new workout
   * Maps to: POST /workouts/addWorkout
   * @param {string} name - e.g. "Morning Run"
   * @param {string} duration - e.g. "30 mins"
   */
  addWorkout(name, duration) {
    return api.post('/workouts/addWorkout', { name, duration })
  },

  /**
   * Fetch all workouts belonging to the logged-in user
   * Maps to: GET /workouts/getMyWorkouts
   */
  getMyWorkouts() {
    return api.get('/workouts/getMyWorkouts')
  },

  /**
   * Update an existing workout by ID
   * Maps to: PATCH /workouts/updateWorkout/:id
   * @param {string} id - workout document _id from MongoDB
   * @param {string} name
   * @param {string} duration
   */
  updateWorkout(id, name, duration) {
    return api.patch(`/workouts/updateWorkout/${id}`, { name, duration })
  },

  /**
   * Delete a workout by ID
   * Maps to: DELETE /workouts/deleteWorkout/:id
   * @param {string} id
   */
  deleteWorkout(id) {
    return api.delete(`/workouts/deleteWorkout/${id}`)
  },

  /**
   * Toggle the "completed" status of a workout
   * Maps to: PATCH /workouts/completeWorkoutStatus/:id
   * @param {string} id
   */
  completeWorkout(id) {
    return api.patch(`/workouts/completeWorkoutStatus/${id}`)
  }
}

export default workoutService
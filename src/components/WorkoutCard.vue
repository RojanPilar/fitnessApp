<script setup>
/**
 * WorkoutCard.vue — Milestone 6 & 8
 * Displays individual workout entries and handles actions
 * for marking complete, editing, and deleting items.
 */
const props = defineProps({
  workout: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'toggle-complete'])
</script>

<template>
  <div class="card workout-card" :class="{ 'is-completed': workout.status === 'completed' }">
    <div class="card-info">
      <h3 class="workout-title">{{ workout.name }}</h3>
      <div class="workout-meta">
        <span class="meta-item">
          <strong>Duration:</strong> {{ workout.duration }} mins
        </span>
        <span class="meta-item">
          <strong>Status:</strong> 
          <span class="badge" :class="workout.status === 'completed' ? 'badge-success' : 'badge-pending'">
            {{ workout.status }}
          </span>
        </span>
      </div>
    </div>
    
    <div class="card-actions">
      <!-- Complete Action -->
      <button 
        v-if="workout.status !== 'completed'" 
        class="btn btn-success btn-sm" 
        @click="emit('toggle-complete', workout._id)"
      >
        Complete
      </button>
      
      <!-- Edit Action -->
      <button class="btn btn-secondary btn-sm" @click="emit('edit', workout)">
        Edit
      </button>
      
      <!-- Delete Action -->
      <button class="btn btn-danger btn-sm" @click="emit('delete', workout._id)">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.workout-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  margin-bottom: 1rem;
  background-color: #1e1e1e;
  border-left: 4px solid #f39c12;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.workout-card.is-completed {
  border-left-color: #42b883;
  opacity: 0.75;
}

.workout-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #ffffff;
}

.workout-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #bbb;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.badge-pending {
  background-color: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.badge-success {
  background-color: rgba(66, 184, 131, 0.2);
  color: #42b883;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
}
</style>

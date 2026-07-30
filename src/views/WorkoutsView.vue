<template>
  <!-- Bootstrap container-fluid handles safe horizontal padding on all viewports -->
  <div class="container-fluid wv">

    <!-- ═══ PAGE HEADER ═══════════════════════════════════════════════════ -->
    <header class="wv__header">
      <div class="wv__title-block">
        <p class="wv__eyebrow">Dashboard</p>
        <h1 class="wv__title">My Workouts</h1>
      </div>

      <RouterLink to="/addWorkouts" class="wv__add-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Log workout
      </RouterLink>
    </header>

    <!-- ═══ STATS GRID ════════════════════════════════════════════════════ -->
    <!-- Bootstrap row + col ensures correct width math. All colour/glass from custom CSS. -->
    <div
      v-if="!workoutStore.isLoading && workoutStore.workouts.length > 0"
      class="row g-2 g-md-3 wv__stats"
    >
      <!-- Total -->
      <div class="col-6 col-md-4 col-lg-3">
        <div class="stat">
          <div class="stat__icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
          </div>
          <div class="stat__body">
            <span class="stat__num">{{ totalWorkouts }}</span>
            <span class="stat__lbl">Total logged</span>
          </div>
        </div>
      </div>

      <!-- Completed -->
      <div class="col-6 col-md-4 col-lg-3">
        <div class="stat stat--mint">
          <div class="stat__icon stat__icon--mint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat__body">
            <span class="stat__num stat__num--mint">{{ completedWorkouts }}</span>
            <span class="stat__lbl">Completed</span>
          </div>
        </div>
      </div>

      <!-- Remaining -->
      <div class="col-6 col-md-4 col-lg-3">
        <div class="stat stat--amber">
          <div class="stat__icon stat__icon--amber">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat__body">
            <span class="stat__num stat__num--amber">{{ pendingWorkouts }}</span>
            <span class="stat__lbl">Remaining</span>
          </div>
        </div>
      </div>

      <!-- Progress bar — spans remaining on lg, full-width below -->
      <div class="col-6 col-md-12 col-lg-3">
        <div class="stat stat--progress">
          <div class="stat__progress-head">
            <span class="stat__lbl">Completion rate</span>
            <span class="stat__pct">{{ completionRate }}%</span>
          </div>
          <div class="stat__track">
            <div class="stat__fill" :style="{ width: completionRate + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ LOADING ═══════════════════════════════════════════════════════ -->
    <div v-if="workoutStore.isLoading" class="wv__loading">
      <span class="wv__spinner"></span>
      <p>Loading your workouts…</p>
    </div>

    <!-- ═══ ERROR ═════════════════════════════════════════════════════════ -->
    <div v-else-if="workoutStore.error" class="wv__alert wv__alert--error" role="alert">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ workoutStore.error }}
    </div>

    <!-- ═══ EMPTY STATE ═══════════════════════════════════════════════════ -->
    <div v-else-if="workoutStore.workouts.length === 0" class="wv__empty">
      <div class="wv__empty-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="1.5" stroke-linecap="round">
          <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>
      <h2 class="wv__empty-title">No workouts yet</h2>
      <p class="wv__empty-text">Log your first session to start tracking progress.</p>
      <RouterLink to="/addWorkouts" class="wv__add-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Log first workout
      </RouterLink>
    </div>

    <!-- ═══ WORKOUT LIST ══════════════════════════════════════════════════ -->
    <!-- Each card occupies col-12 — full-width stacked list, never clips -->
    <div v-else class="row g-2 g-md-3 wv__list">
      <div
        v-for="workout in workoutStore.workouts"
        :key="workout._id"
        class="col-12"
      >
        <WorkoutCard :workout="workout" @edit="openEditModal" />
      </div>
    </div>

    <!-- ═══ EDIT MODAL ════════════════════════════════════════════════════ -->
    <EditWorkoutModal
      v-if="editingWorkout"
      :workout="editingWorkout"
      @close="closeEditModal"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useWorkoutStore } from '@/stores/workouts'
import WorkoutCard from '@/components/WorkoutCard.vue'
import EditWorkoutModal from '@/components/EditWorkoutModal.vue'

const workoutStore   = useWorkoutStore()
const editingWorkout = ref(null)

function openEditModal(w) { editingWorkout.value = w }
function closeEditModal()  { editingWorkout.value = null }

const totalWorkouts     = computed(() => workoutStore.workouts.length)
const completedWorkouts = computed(() => workoutStore.workouts.filter(w => w.status === 'completed').length)
const pendingWorkouts   = computed(() => workoutStore.workouts.filter(w => w.status !== 'completed').length)
const completionRate    = computed(() =>
  totalWorkouts.value === 0
    ? 0
    : Math.round((completedWorkouts.value / totalWorkouts.value) * 100)
)

onMounted(() => workoutStore.fetchWorkouts())
</script>

<style scoped>

/* ── Page wrapper ────────────────────────────────────────────────────────── */
.wv {
  /* Safe horizontal gutter — 16px mobile, 24px md+ */
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
  padding-top: 2rem;
  padding-bottom: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Page header ─────────────────────────────────────────────────────────── */
.wv__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.wv__eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #10B981;
  margin: 0 0 0.3rem;
}

.wv__title {
  font-size: clamp(1.6rem, 5vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: #F0F4FF;
  margin: 0;
}

/* ── CTA / Add button ────────────────────────────────────────────────────── */
.wv__add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #10B981;
  color: #032917;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.25);
  transition:
    background  150ms cubic-bezier(0.16,1,0.3,1),
    box-shadow  150ms cubic-bezier(0.16,1,0.3,1),
    transform   150ms cubic-bezier(0.16,1,0.3,1);
  flex-shrink: 0;
}
.wv__add-btn:hover {
  background: #0EA572;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.35);
  transform: translateY(-1px);
  color: #032917;
}

/* ── Stats block ─────────────────────────────────────────────────────────── */
.wv__stats {
  margin-bottom: 1.75rem;
}

/* Base stat card */
.stat {
  /* Glassmorphic surface */
  background: rgba(22, 27, 38, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  height: 100%;

  display: flex;
  align-items: center;
  gap: 0.8rem;

  box-shadow: 0 1px 3px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.25);
  transition:
    border-color  200ms ease,
    transform     200ms cubic-bezier(0.16,1,0.3,1);
}

.stat:hover {
  border-color: rgba(255, 255, 255, 0.09);
  transform: translateY(-1px);
}

/* Progress stat — vertical layout override */
.stat--progress {
  display: block;
  padding: 0.9rem 1.1rem;
}

/* Stat icon tokens */
.stat__icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  color: #8A97B0;
}
.stat__icon--mint  { background: rgba(16,185,129,0.12);  color: #10B981; }
.stat__icon--amber { background: rgba(245,158,11,0.12);  color: #F59E0B; }

/* Number */
.stat__num {
  display: block;
  font-size: clamp(1.3rem, 3.5vw, 1.65rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #F0F4FF;
}
.stat__num--mint  { color: #10B981; }
.stat__num--amber { color: #F59E0B; }

/* Label */
.stat__lbl {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4A5568;
  white-space: nowrap;
  margin-top: 0.1rem;
}

/* Progress bar */
.stat__progress-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
}
.stat__pct {
  font-size: 0.875rem;
  font-weight: 700;
  color: #10B981;
}
.stat__track {
  height: 5px;
  background: rgba(255,255,255,0.07);
  border-radius: 999px;
  overflow: hidden;
}
.stat__fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #34D399);
  border-radius: 999px;
  box-shadow: 0 0 8px rgba(16,185,129,0.4);
  transition: width 0.85s cubic-bezier(0.16,1,0.3,1);
}

/* ── Loading ─────────────────────────────────────────────────────────────── */
.wv__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 220px;
  color: #8A97B0;
  font-size: 0.9rem;
}

.wv__spinner {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: #10B981;
  border-radius: 50%;
  animation: wv-spin 0.7s linear infinite;
}

@keyframes wv-spin { to { transform: rotate(360deg); } }

/* ── Alert ───────────────────────────────────────────────────────────────── */
.wv__alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}
.wv__alert--error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.22);
  color: #FCA5A5;
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
.wv__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 300px;
  text-align: center;
  padding: 2rem 1rem;
}
.wv__empty-icon {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4A5568;
  margin-bottom: 0.5rem;
}
.wv__empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #F0F4FF;
  margin: 0;
}
.wv__empty-text {
  color: #8A97B0;
  font-size: 0.9rem;
  max-width: 260px;
  margin: 0 0 0.5rem;
}

/* ── Workout list spacer ─────────────────────────────────────────────────── */
.wv__list {
  /* inherits Bootstrap row gutter; nothing extra needed */
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE TWEAKS
═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 575px) {
  .wv { padding-top: 1.5rem; }

  .wv__header { margin-bottom: 1.25rem; }

  /* On very small screens, stat numbers compress gracefully */
  .stat { padding: 0.8rem 0.9rem; gap: 0.65rem; }
  .stat__icon { width: 28px; height: 28px; }
}

@media (min-width: 576px) and (max-width: 767px) {
  /* md breakpoint — progress card spans full width */
  /* Already handled by Bootstrap col-md-12 on progress card */
}
</style>
<template>
  <article
    class="wc"
    :class="[
      workout.status === 'completed' ? 'wc--done' : 'wc--pending',
    ]"
  >
    <!-- ── Left accent rail ──────────────────────────────────────────── -->
    <div class="wc__rail" aria-hidden="true"></div>

    <!-- ── Card body ─────────────────────────────────────────────────── -->
    <div class="wc__body">

      <!-- Row 1 – meta + badge (always horizontal) -->
      <div class="wc__top">
        <div class="wc__meta">
          <h3 class="wc__name">{{ workout.name }}</h3>
          <p class="wc__duration">
            <svg class="wc__clock" width="11" height="11" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <!-- Render duration exactly as stored — no suffix appended here -->
            {{ workout.duration }}
          </p>
        </div>

        <span class="wc__badge" :class="workout.status === 'completed' ? 'wc__badge--done' : 'wc__badge--pending'">
          <span v-if="workout.status === 'completed'">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            Done
          </span>
          <span v-else>Pending</span>
        </span>
      </div>

      <!-- Inline error -->
      <p v-if="cardError" class="wc__error" role="alert">{{ cardError }}</p>

      <!-- Row 2 – action buttons -->
      <div class="wc__actions">
        <button
          v-if="workout.status !== 'completed'"
          class="wc__btn wc__btn--complete"
          :disabled="isProcessing"
          @click="handleComplete"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Complete
        </button>

        <button
          class="wc__btn wc__btn--edit"
          :disabled="isProcessing"
          @click="$emit('edit', workout)"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>

        <button
          class="wc__btn wc__btn--delete"
          :disabled="isProcessing"
          @click="handleDelete"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Delete
        </button>

        <span v-if="isProcessing" class="wc__spinner" aria-label="Processing…">
          <span class="wc__spinner-ring"></span>
        </span>
      </div>

    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkoutStore } from '@/stores/workouts'

const props = defineProps({
  workout: { type: Object, required: true }
})
const emit = defineEmits(['edit'])

const workoutStore = useWorkoutStore()
const isProcessing = ref(false)
const cardError    = ref('')

async function handleComplete() {
  isProcessing.value = true
  cardError.value    = ''
  try   { await workoutStore.toggleComplete(props.workout._id) }
  catch { cardError.value = 'Could not update status.' }
  finally { isProcessing.value = false }
}

async function handleDelete() {
  if (!confirm(`Delete "${props.workout.name}"? This cannot be undone.`)) return
  isProcessing.value = true
  cardError.value    = ''
  try   { await workoutStore.deleteWorkout(props.workout._id) }
  catch { cardError.value = 'Could not delete workout.' }
  finally { isProcessing.value = false }
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   WORKOUT CARD  ·  2026 dark-tech premium aesthetic
   All sizing is self-contained — zero Bootstrap colour utilities used.
═══════════════════════════════════════════════════════════════════════════ */

/* ── Shell ────────────────────────────────────────────────────────────────── */
.wc {
  /* Layout */
  display: flex;
  width: 100%;
  min-width: 0;           /* critical: prevents flex children from overflowing */
  overflow: hidden;

  /* Surface */
  background: #161B26;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;

  /* Elevation */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.3);

  /* Motion */
  transition:
    transform      250ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow     250ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color   250ms cubic-bezier(0.16, 1, 0.3, 1);

  /* Completed cards recede slightly */
  &.wc--done { opacity: 0.72; }
}

.wc:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 2px 8px  rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0  24px  rgba(16, 185, 129, 0.06);
}

.wc--done:hover  { opacity: 0.92; }

/* ── Left rail ───────────────────────────────────────────────────────────── */
.wc__rail {
  width: 3px;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 0;
}

.wc--done    .wc__rail { background: linear-gradient(180deg, #10B981 0%, rgba(16,185,129,0.15) 100%); }
.wc--pending .wc__rail { background: linear-gradient(180deg, #F59E0B 0%, rgba(245,158,11,0.15) 100%); }

/* ── Body ────────────────────────────────────────────────────────────────── */
.wc__body {
  flex: 1;
  min-width: 0;           /* prevent overflow from long names */
  padding: 1rem 1.1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* ── Top row: meta + badge ───────────────────────────────────────────────── */
.wc__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 0;
}

.wc__meta {
  flex: 1;
  min-width: 0;           /* truncation anchor */
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

/* Workout name — truncate on overflow, never wrap */
.wc__name {
  font-size: 0.975rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #F0F4FF;
  line-height: 1.3;
  /* Prevent name overflow blowing the card */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* Duration — single-line guarantee */
.wc__duration {
  display: flex;
  align-items: center;
  gap: 0.32rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #8A97B0;
  /* CRITICAL: never wrap, never stack */
  white-space: nowrap;
  flex-wrap: nowrap;
  margin: 0;
  line-height: 1;
}

.wc__clock {
  flex-shrink: 0;
  opacity: 0.7;
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
.wc__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
}

.wc__badge span {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
}

.wc__badge--done {
  background: rgba(16, 185, 129, 0.12);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.22);
}

.wc__badge--pending {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

/* ── Error ───────────────────────────────────────────────────────────────── */
.wc__error {
  font-size: 0.78rem;
  font-weight: 500;
  color: #EF4444;
  margin: 0;
  padding: 0.4rem 0.7rem;
  background: rgba(239, 68, 68, 0.08);
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.15);
}

/* ── Actions row ─────────────────────────────────────────────────────────── */
.wc__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: nowrap;        /* desktop: single row */
}

/* ── Base button token ───────────────────────────────────────────────────── */
.wc__btn {
  /* Reset */
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;

  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.32rem;
  white-space: nowrap;

  /* Typography */
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;

  /* Shape */
  padding: 0.38rem 0.8rem;
  border-radius: 7px;

  /* Motion */
  transition:
    background    150ms cubic-bezier(0.16, 1, 0.3, 1),
    color         150ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color  150ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow    150ms cubic-bezier(0.16, 1, 0.3, 1),
    transform     150ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity       150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.wc__btn:active   { transform: scale(0.95); }
.wc__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

/* Complete — ghost mint outline → solid fill on hover */
.wc__btn--complete {
  color: #10B981;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.wc__btn--complete:hover:not(:disabled) {
  background: #10B981;
  color: #032917;
  border-color: #10B981;
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

/* Edit — neutral ghost → subtle white tint on hover */
.wc__btn--edit {
  color: #8A97B0;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.wc__btn--edit:hover:not(:disabled) {
  color: #F0F4FF;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

/* Delete — muted crimson text → solid danger fill on hover */
.wc__btn--delete {
  color: rgba(239, 68, 68, 0.7);
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.15);
}
.wc__btn--delete:hover:not(:disabled) {
  color: #fff;
  background: #EF4444;
  border-color: #EF4444;
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.28);
  transform: translateY(-1px);
}

/* ── Spinner ─────────────────────────────────────────────────────────────── */
.wc__spinner {
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
}
.wc__spinner-ring {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-top-color: #10B981;
  border-radius: 50%;
  animation: wc-spin 0.65s linear infinite;
}

@keyframes wc-spin {
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE  ·  ≤ 575px
   Buttons expand into a full-width, equal-height touch group at card bottom.
═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 575px) {

  .wc__body { padding: 0.85rem 0.9rem 0.85rem 0.8rem; gap: 0.75rem; }

  .wc__name { font-size: 0.93rem; }

  /* Allow name to wrap on very small screens so it's never truncated when
     there's no horizontal space — fall back to wrapping rather than clipping */
  .wc__name {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }

  /* Actions: switch to a wrapping block-fill grid */
  .wc__actions {
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .wc__btn {
    flex: 1 1 auto;         /* grow to fill but don't force equal widths */
    min-width: calc(50% - 0.2rem); /* 2-up on most phones */
    padding: 0.52rem 0.6rem;
    font-size: 0.78rem;
  }

  /* Complete alone takes full row if it's the only wide button */
  .wc__btn--complete:only-of-type {
    min-width: 100%;
  }
}
</style>
<template>
  <div class="page-wrapper">
    <!-- ─── Navbar ─────────────────────────────────────────────────────────── -->
    <nav v-if="auth.isLoggedIn" class="navbar">
      <div class="container navbar-inner">
        <!-- Brand -->
        <RouterLink to="/workouts" class="navbar-brand">
          <span class="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </span>
          <span class="brand-text">Rojan<span class="brand-accent">Fit</span></span>
        </RouterLink>

        <!-- Nav Links -->
        <div class="navbar-links">
          <RouterLink to="/workouts" class="nav-link" active-class="nav-link--active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            Workouts
          </RouterLink>
          <RouterLink to="/addWorkouts" class="nav-link nav-link-add" active-class="nav-link--active">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Log Workout
          </RouterLink>
        </div>

        <!-- Logout -->
        <button class="btn btn-ghost logout-btn" @click="handleLogout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </nav>

    <!-- ─── Page Content ──────────────────────────────────────────────────── -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ─── Navbar ──────────────────────────────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(11, 15, 25, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-dim);
}

.navbar-inner {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 2rem;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-mark {
  width: 32px;
  height: 32px;
  background: var(--mint-dim);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mint);
  transition: background var(--dur-fast) var(--ease),
              box-shadow var(--dur-fast) var(--ease);
}

.navbar-brand:hover .brand-mark {
  background: rgba(16, 185, 129, 0.2);
  box-shadow: var(--shadow-mint);
}

.brand-text {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.brand-accent {
  color: var(--mint);
}

/* Nav Links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease),
              background var(--dur-fast) var(--ease);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--surface-2);
}

.nav-link--active {
  color: var(--mint) !important;
  background: var(--mint-dim) !important;
}

.nav-link-add {
  color: var(--mint);
  background: var(--mint-dim);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.nav-link-add:hover {
  color: var(--text-on-mint) !important;
  background: var(--mint) !important;
}

.nav-link-add.nav-link--active {
  color: var(--text-on-mint) !important;
  background: var(--mint) !important;
}

/* Logout */
.logout-btn {
  font-size: 0.82rem;
  padding: 0.45rem 0.9rem;
  flex-shrink: 0;
}

/* Main */
.main-content {
  flex: 1;
  padding: 2.5rem 0;
}

@media (max-width: 640px) {
  .navbar-inner { gap: 1rem; }
  .brand-text { display: none; }
  .nav-link span { display: none; }
  .logout-btn span { display: none; }
}
</style>
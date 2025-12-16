<template>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <h1>Dashboard</h1>
            <div class="user-info">
                <span v-if="authStore.user">Bienvenido, {{ authStore.user.name || authStore.user.email }}</span>
                <button @click="handleLogout" class="btn-logout">Cerrar sesión</button>
            </div>
        </header>
        <main class="dashboard-content">

        </main>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout() {
    await authStore.logout();
    router.push({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.dashboard-container {}

.dashboard-header {
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
        margin: 0;
        color: #333;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 2rem;

        span {
            color: #666;
        }
    }
}

.btn-logout {
    padding: 0.5rem 1rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s;

    &:hover {
        background: #c0392b;
    }
}
</style>

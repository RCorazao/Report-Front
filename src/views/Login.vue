<template>
    <div class="login-container">
        <div class="login-card">
            <h1>Inicio de sesión</h1>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Correo</label>
                    <input id="email" v-model="email" type="email" required placeholder="Ingresa tu correo" />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input id="password" v-model="password" type="password" required
                        placeholder="Ingresa tu contraseña" />
                </div>
                <div v-if="error" class="error-message">
                    {{ error }}
                </div>
                <button type="submit" :disabled="loading" class="btn-primary">
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
    loading.value = true;
    error.value = '';

    try {
        await authStore.login(email.value, password.value);
        router.push({ name: 'Dashboard' });
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.';
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped lang="scss">
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #ffffff;
}

.login-card {
    padding: 3rem 2.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    width: 400px;

    h1 {
        margin-bottom: 2rem;
        text-align: center;
        font-size: 1.75rem;
        font-weight: 600;
    }
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;

    label {
        font-weight: 500;
        font-size: 1rem;
    }

    input {
        padding: 0.75rem 1rem;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        font-size: 1rem;
        background: #ffffff;
        color: #000000;
        transition: all 0.2s;

        &::placeholder {
            color: #999999;
        }

        &:focus {
            outline: none;
            border-color: #000000;
            box-shadow: 0 0 0 1px #000000;
        }
    }
}

.error-message {
    color: #000000;
    background: #f5f5f5;
    border: 1px solid #d0d0d0;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
}

.btn-primary {
    padding: 0.875rem;
    background: #000000;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;

    &:hover:not(:disabled) {
        background: #333333;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>

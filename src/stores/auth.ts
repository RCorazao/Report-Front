import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/auth.types';
import { authService } from '@/services/api/auth.service';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(getUserFromStorage());
    const token = ref<string | null>(localStorage.getItem('auth_token'));

    const isAuthenticated = computed(() => !!token.value && !!user.value);

    function getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('auth_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    async function login(email: string, password: string) {
        try {
            const response = await authService.login({ email, password });

            if (!response.success) {
                throw new Error(response.message);
            }

            token.value = response.data!.token;
            user.value = response.data!.user;
            localStorage.setItem('auth_token', response.data!.token);
            localStorage.setItem('auth_user', JSON.stringify(response.data!.user));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async function logout() {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    }

    function checkAuth() {
        if (!token.value) return false;

        const storedUser = getUserFromStorage();
        if (!storedUser) {
            logout();
            return false;
        }

        user.value = storedUser;
        return true;
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        checkAuth,
    };
});

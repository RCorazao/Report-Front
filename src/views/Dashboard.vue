<template>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <div class="logo">tk<span>ambio</span></div>
            <button @click="handleLogout" class="btn-logout">Cerrar sesión</button>
        </header>
        <main class="dashboard-content">
            <h1 class="title">Generador de reportes TK</h1>

            <div v-if="loading" class="loading">Cargando reportes...</div>
            <div v-else-if="error" class="error-message">{{ error }}</div>
            <div v-else-if="reports.length === 0" class="empty-message">No hay reportes disponibles</div>
            <div v-else class="table-wrapper">
                <table class="reports-table">
                    <thead>
                        <tr>
                            <th class="col-title">Titulo</th>
                            <th class="col-date">Fecha de creación</th>
                            <th class="col-action">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="report in reports" :key="report.id">
                            <td class="col-title" data-label="Título">{{ report.title }}</td>
                            <td class="col-date" data-label="Fecha de creación">{{ formatDate(report.created_at) }}</td>
                            <td class="col-action" data-label="Acción">
                                <a :href="report.download_url" target="_blank" class="btn-download">
                                    Descargar <img src="@/assets/download.svg" class="download-icon" alt="download" />
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button @click="showModal = true" class="btn-create">Crear reporte</button>
        </main>

        <CreateReportModal v-model="showModal" :is-loading="isGenerating" :error-message="modalError"
            :validation-errors="validationErrors" @submit="generateReport" @clear-errors="clearModalErrors" />

        <Toast v-model="showToast" :message="toastMessage" type="success" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import CreateReportModal from '@/components/CreateReportModal.vue';
import Toast from '@/components/Toast.vue';
import { reportService } from '@/services/api/report.service';
import type { Report } from '@/types/report.types';
import type { Errors } from '@/types/api.types';

const router = useRouter();
const authStore = useAuthStore();

const showModal = ref(false);
const reports = ref<Report[]>([]);
const loading = ref(false);
const error = ref('');

// Modal
const isGenerating = ref(false);
const modalError = ref('');
const validationErrors = ref<Record<string, string[]>>({});

// Toast
const showToast = ref(false);
const toastMessage = ref('');

async function loadReports() {
    loading.value = true;
    error.value = '';
    try {
        const response = await reportService.listReports();
        if (response.success && response.data) {
            reports.value = response.data;
        } else {
            error.value = response.message || 'Error al cargar reportes';
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error al cargar reportes';
    } finally {
        loading.value = false;
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function clearModalErrors() {
    modalError.value = '';
    validationErrors.value = {};
}

async function generateReport(data: { description: string; startDate: string; endDate: string }) {
    isGenerating.value = true;
    clearModalErrors();

    try {
        const response = await reportService.generateReport({
            title: data.description,
            start_date: data.startDate,
            end_date: data.endDate
        });

        if (response.success) {
            showModal.value = false;
            toastMessage.value = response.message || 'El reporte se está generando en segundo plano';
            showToast.value = true;
        } else {
            modalError.value = response.message || 'Error al generar reporte';
            if (response.errors) {
                validationErrors.value = response.errors as Errors;
            }
        }
    } catch (err: any) {
        const errorData = err.response?.data;
        modalError.value = errorData?.message || 'Error al generar reporte';
        if (errorData?.errors) {
            validationErrors.value = errorData.errors;
        }
    } finally {
        isGenerating.value = false;
    }
}

async function handleLogout() {
    await authStore.logout();
    router.push({ name: 'Login' });
}

onMounted(() => {
    loadReports();
});
</script>

<style scoped lang="scss">
.dashboard-container {
    min-height: 100vh;
    background: #f0f0f0;
}

.dashboard-header {
    background: linear-gradient(0deg,
            #4563e6 0%,
            #1aa7e1 100%);
    padding: 0.8rem 2rem;
    text-align: center;

    .logo {
        color: #FFC107;
        font-size: 2.5rem;
        font-weight: 700;

        span {
            color: #fff;
        }
    }
}

.btn-logout {
    position: absolute;
    top: 1.5rem;
    right: 2rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}

.dashboard-content {
    padding: 3rem 1rem;
    max-width: 800px;
    margin: 0 auto;
}

.title {
    text-align: center;
    font-size: 1.75rem;
    margin: 0 0 5rem;
    font-weight: 600;
}

.table-wrapper {
    margin-bottom: 2.5rem;
    overflow-x: auto;
    background: #4563e6;
    padding: 0 2rem 2rem 2rem;
    border-radius: 12px;
}

.reports-table {
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    overflow: hidden;

    thead th {
        color: #fff;
        font-size: large;
        font-weight: 450;
        padding: 0.8rem 0;
        border-bottom: 5px solid #c4c4c4;
    }

    .col-title {
        text-align: left;
        width: 28%;
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .col-date {
        text-align: center;
        width: 40%;
    }

    .col-action {
        text-align: right;
        width: 30%;
    }

    tbody tr:not(:last-child) td {
        border-bottom: 1px solid #c4c4c4;
    }

    tbody td {
        color: #fff;
        padding: 0.8rem 0;
        position: relative;

        &.col-date::before,
        &.col-date::after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 50%;
            background: #c4c4c4;
        }

        &.col-date::before {
            left: 0;
        }

        &.col-date::after {
            right: 0;
        }
    }
}

.btn-download {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;

    .download-icon {
        width: 18px;
        height: 18px;
        filter: brightness(0) invert(1);
    }

    &:hover {
        text-decoration: underline;
    }
}

@media (max-width: 600px) {
    .table-wrapper {
        -webkit-overflow-scrolling: touch;
    }

    .reports-table {
        min-width: 500px;
    }
}

.loading,
.error-message,
.empty-message {
    text-align: center;
    padding: 3rem 2rem;
    color: #666;
}

.error-message {
    color: #c0392b;
    background: #fadbd8;
    border-radius: 12px;
}

.btn-create {
    display: block;
    margin: 0 auto;
    padding: 1rem 3rem;
    background: #ffbe12;
    border: none;
    border-radius: 30px;
    font-weight: 700;
    font-size: 1rem;
    color: #000;

    cursor: pointer;

    &:hover {
        background: #FFB300;
    }
}
</style>

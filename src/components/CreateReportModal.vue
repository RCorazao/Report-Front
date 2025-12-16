<template>
    <div v-if="modelValue" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <h2>Reporte por fecha de nacimiento</h2>
            <p class="modal-subtitle">Ingresa los siguientes datos para generar tu reporte</p>

            <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>

            <form @submit.prevent="handleSubmit">
                <fieldset class="input-fieldset" :class="{ 'has-error': errors.title }">
                    <legend>Descripción del reporte</legend>
                    <input v-model="formData.description" type="text" placeholder="Reporte de usuario 1" required />
                </fieldset>
                <span v-if="errors.title" class="field-error">{{ errors.title }}</span>

                <label class="section-label">Fecha de nacimiento</label>
                <div class="date-inputs">
                    <div class="date-field-wrapper">
                        <fieldset class="input-fieldset" :class="{ 'has-error': errors.start_date }">
                            <legend>Inicio</legend>
                            <div class="date-wrapper">
                                <input ref="startDateInput" v-model="formData.startDate" type="date" required />
                                <img src="@/assets/calendar.svg" class="calendar-icon" alt="calendar"
                                    @click="openDatePicker('start')" />
                            </div>
                        </fieldset>
                        <span v-if="errors.start_date" class="field-error">{{ errors.start_date }}</span>
                    </div>
                    <div class="date-field-wrapper">
                        <fieldset class="input-fieldset date-fieldset" :class="{ 'has-error': errors.end_date }">
                            <legend>Fin</legend>
                            <div class="date-wrapper">
                                <input ref="endDateInput" v-model="formData.endDate" type="date" required />
                                <img src="@/assets/calendar.svg" class="calendar-icon" alt="calendar"
                                    @click="openDatePicker('end')" />
                            </div>
                        </fieldset>
                        <span v-if="errors.end_date" class="field-error">{{ errors.end_date }}</span>
                    </div>
                </div>

                <button type="submit" class="btn-generate" :disabled="isLoading">
                    {{ isLoading ? 'Generando...' : 'Generar reporte' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Errors } from '@/types/api.types';
import { ref, watch } from 'vue';

interface ValidationErrors {
    title?: string;
    start_date?: string;
    end_date?: string;
}

interface Props {
    modelValue: boolean;
    isLoading?: boolean;
    errorMessage?: string;
    validationErrors?: Errors;
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'submit', data: { description: string; startDate: string; endDate: string }): void;
    (e: 'clearErrors'): void;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    errorMessage: '',
    validationErrors: () => ({})
});
const emit = defineEmits<Emits>();

const formData = ref({
    description: '',
    startDate: '',
    endDate: ''
});

const errors = ref<ValidationErrors>({});

const startDateInput = ref<HTMLInputElement | null>(null);
const endDateInput = ref<HTMLInputElement | null>(null);

function openDatePicker(type: 'start' | 'end') {
    const input = type === 'start' ? startDateInput.value : endDateInput.value;
    input?.showPicker();
}

function closeModal() {
    emit('update:modelValue', false);
    emit('clearErrors');
    resetForm();
}

function resetForm() {
    formData.value = {
        description: '',
        startDate: '',
        endDate: ''
    };
    errors.value = {};
}

function handleSubmit() {
    emit('submit', { ...formData.value });
}

watch(() => props.validationErrors, (newErrors) => {
    errors.value = {};
    if (newErrors) {
        for (const [key, messages] of Object.entries(newErrors)) {
            if (messages && messages.length > 0) {
                errors.value[key as keyof ValidationErrors] = messages[0];
            }
        }
    }
}, { immediate: true, deep: true });

watch(() => props.modelValue, (newValue) => {
    if (!newValue) {
        resetForm();
    }
});
</script>

<style scoped lang="scss">
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #ffffff;
    padding: 2.5rem 3rem;
    border-radius: 16px;
    width: 90%;
    max-width: 550px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

    h2 {
        margin: 0 0 0.5rem;
        color: #000000;
        font-size: 1.5rem;
        font-weight: 800;
        text-align: center;
    }

    .modal-subtitle {
        color: #888888;
        margin: 0 0 2rem;
        font-size: 1.025rem;
        text-align: center;
    }
}

.input-fieldset {
    border: 1px solid #d0d0d0;
    border-radius: 10px;
    padding: 0.8rem;
    margin: 0 0 1.5rem;
    position: relative;

    legend {
        padding: 0 0.2rem;
        color: #888888;
        font-size: 0.875rem;
    }

    input {
        width: 100%;
        border: none;
        outline: none;
        font-size: 0.9rem;
        color: #000000;
        background: transparent;

        &::placeholder {
            color: #aaaaaa;
        }
    }

    input[type="date"] {
        cursor: pointer;
        color-scheme: light;
    }
}

.date-wrapper {
    display: flex;
    align-items: center;
    width: 100%;

    input[type="date"] {
        flex: 1;
        border: none;
        outline: none;
        font-size: 0.9rem;
        color: #000000;
        background: transparent;
        cursor: pointer;

        &::-webkit-calendar-picker-indicator {
            display: none;
        }
    }
}

.calendar-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
    opacity: 0.6;

    &:hover {
        opacity: 0.8;
    }
}

.section-label {
    display: block;
    color: #888888;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
}

.date-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    .input-fieldset {
        margin-bottom: 0;
    }
}

.error-banner {
    background: #fee2e2;
    color: #dc2626;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    text-align: center;
}

.input-fieldset.has-error {
    border-color: #dc2626;
}

.field-error {
    display: block;
    color: #dc2626;
    font-size: 0.75rem;
    margin-top: -1.25rem;
    margin-bottom: 1rem;
}

.date-field-wrapper {
    .field-error {
        margin-top: 0.25rem;
        margin-bottom: 0;
    }
}

.btn-generate {
    display: block;
    margin: 2rem auto 0;
    padding: 1rem 3rem;
    background: #d5d5d5;
    color: #000000;
    border: none;
    border-radius: 30px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 3px rgba(0, 0, 0, 0.25);
    transition: background 0.2s;

    &:hover {
        background: #c5c5c5;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}
</style>

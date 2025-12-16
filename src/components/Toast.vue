<template>
    <Teleport to="body">
        <Transition name="toast">
            <div v-if="visible" class="toast" :class="type">
                <span class="toast-message">{{ message }}</span>
                <button class="toast-close" @click="close">&times;</button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    modelValue: boolean;
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'success',
    duration: 4000
});
const emit = defineEmits<Emits>();

const visible = ref(props.modelValue);
let timeout: ReturnType<typeof setTimeout>;

function close() {
    visible.value = false;
    emit('update:modelValue', false);
}

watch(() => props.modelValue, (newValue) => {
    visible.value = newValue;
    if (newValue && props.duration > 0) {
        clearTimeout(timeout);
        timeout = setTimeout(close, props.duration);
    }
});
</script>

<style scoped lang="scss">
.toast {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    max-width: 400px;

    &.success {
        background: #10b981;
        color: #fff;
    }

    &.error {
        background: #ef4444;
        color: #fff;
    }

    &.info {
        background: #3b82f6;
        color: #fff;
    }
}

.toast-message {
    flex: 1;
    font-size: 0.95rem;
}

.toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.25rem;
    cursor: pointer;
    opacity: 0.8;
    padding: 0;
    line-height: 1;

    &:hover {
        opacity: 1;
    }
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>

<script setup lang="ts">

type Variant = 'primary' | 'secondary' | 'secondarySelectPrimary';

interface Props {
    text?: String
    variant?: Variant;
}

defineProps<Props>();


const variantClasses = {
    primary: 'button button-primary',
    secondary: 'button button-secondary',
    secondarySelectPrimary: 'button button-secondary-select-primary',
};

const getVariantClasses = (variant: Variant) => {
    return variantClasses[variant] || variantClasses.primary;
};

</script>

<template>
    <button
        :class="getVariantClasses(variant ?? 'primary')">
        <p class="text-center font-semibold">{{ text }}</p>
    </button>
</template>
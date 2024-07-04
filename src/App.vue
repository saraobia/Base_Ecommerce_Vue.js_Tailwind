<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';
import NoHeaderFooterLayout from './layouts/NoHeaderFooterLayout.vue';

const route = useRoute();

const layout = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  if (layoutName === 'NoHeaderFooterLayout') {
    return NoHeaderFooterLayout;
  }
  return DefaultLayout;
});
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

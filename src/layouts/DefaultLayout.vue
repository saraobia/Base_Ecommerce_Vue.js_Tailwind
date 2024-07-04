<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div>
    <Header />
    <main class="min-h-screen bg-background">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

const backToHome = () => {
  router.push('/home');
}

</script>

<template>
  <div class=" h-screen border flex flex-col items-center justify-center">
    <h1 class="z-10 text-8xl font-black text-white mb-2">404</h1>
    <div class="h-auto absolute">
    </div>
    <div class=" z-10 flex items-center text-sm font-bold">
      <h3 class="text-darkGray ">Content not found, but you can</h3>
      <button @click="backToHome" class=" mx-2 p-2 bg-light shadow-xl text-white rounded-md hover:bg-middle">Back to
        home</button>
    </div>
  </div>
</template>
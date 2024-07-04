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
      <svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        width="300px">
        <path fill="#9cc9d0"
          d="M391,291.5Q382,343,334,361.5Q286,380,234,398.5Q182,417,128.5,388.5Q75,360,46,300Q17,240,35.5,172.5Q54,105,122,95.5Q190,86,250.5,54Q311,22,368,64Q425,106,412.5,173Q400,240,391,291.5Z" />
      </svg>
    </div>
    <div class=" z-10 flex items-center text-sm font-bold">
      <h3 class="text-darkGray ">Content not found, but you can</h3>
      <button @click="backToHome" class=" mx-2 p-2 bg-light shadow-xl text-white rounded-md hover:bg-middle">Back to
        home</button>
    </div>
  </div>
</template>
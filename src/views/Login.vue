<script setup>
import { onMounted } from 'vue';
import Login from '../components/Login.vue';
import { useRouter } from 'vue-router';

const accessToken = localStorage.getItem('accessToken');
const router = useRouter();


const manageLogin = () => {
  if (accessToken !== null) {
    router.push('/home');
  }
}

onMounted(manageLogin);

</script>

<template>
  <main>
    <div class="h-screen flex items-center justify-center">
      <Login />
    </div>
  </main>
</template>
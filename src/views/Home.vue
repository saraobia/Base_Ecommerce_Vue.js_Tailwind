<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/axiosInstance';
import { useRouter } from 'vue-router';
import CardArticle from '../components/CardArticle.vue';


const accessToken = localStorage.getItem('accessToken');
const email = localStorage.getItem('email');
const showMessage = ref(false);
const countdown = ref(5);
const router = useRouter();
const loading = ref(true);
const articles = ref([]);

const fetchClient = async () => {
  try {
    if (!accessToken) {
      showMessage.value = true;
      const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(interval);
          router.push('/');
        }
      }, 1000);
      return;
    }

    const response = await axiosInstance.get(`client/${email}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    localStorage.setItem('name', response.data.name);
    localStorage.setItem('surname', response.data.surname);
    localStorage.setItem('idClient', response.data.idClient);

  } catch (error) {
    console.error('Error fetching client:', error);
  } finally {
    loading.value = false;
  }
};


const fetchArticles = async () => {
  try {
    if (!accessToken) {
      showMessage.value = true;
      const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(interval);
          router.push('/');
        }
      }, 1000);
      return;
    }

    const response = await axiosInstance.get(`articles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    articles.value = response.data;
    console.log(articles.value);


  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};
onMounted(fetchArticles);
onMounted(fetchClient);

</script>



<template>
  <!-- LOADING -->
  <div>
    <!-- ERROR MESSAGE -->
    <div v-if="showMessage" class="absolute z-50 inset-0 flex items-center justify-center  backdrop-blur-lg">
      <div class="bg-white p-12 rounded-lg shadow-lg">
        <p class="text-md text-center font-bold text-warning">Session expired. Redirecting...</p>
        <p class="text-center text-xs text-darkGray">Returning to homepage in {{ countdown }} seconds</p>
      </div>
    </div>

    <section v-if="loading" class="h-screen flex items-center justify-center">
      <div class="text-center flex  items-center justify-center">
        <svg class="h-8 w-8" viewBox="0 0 24 24">
          <circle class="animate-pulse" cx="12" cy="12" r="10" stroke="#61a4ad" stroke-width="4" fill="#07575b">
          </circle>
        </svg>
        <p class="text-middle mx-1 font-extrabold text-center">Loading</p>
      </div>
    </section>


    <!-- MAIN CONTENT -->
    <section v-else class="h-80 flex flex-col items-center justify-center">

      <h2 class="text-4xl font-semibold text-tGray">Welcome to our</h2>
      <h1 class="text-white text-6xl">Tech Store</h1>

    </section>

    <!-- CARD ARTICLES -->
    <div class="flex items-center justify-center">
      <div class=" grid grid-cols-1 bigSmartphone:grid-cols-2 laptop:grid-cols-3 gap-4">
        <CardArticle v-for="article in articles" :key="article.id" :article="article" />
      </div>
    </div>
  </div>

</template>
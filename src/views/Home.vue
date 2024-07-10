<script setup>
import { ref, onMounted } from 'vue';
import CardArticle from '../components/CardArticle.vue';
import axiosInstance from '@/axiosInstance';
import useAuth from '@/composable/useAuth';

const { showMessage, countdown, checkAccessToken } = useAuth();
const accessToken = localStorage.getItem('accessToken');
const email = localStorage.getItem('email');
const loading = ref(true);
const articles = ref([]);


//GET CLIENT
const fetchClient = async () => {
  try {
    if (!checkAccessToken(accessToken)) {
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

// GET ARTICLES
const fetchArticles = async () => {
  try {
    if (!checkAccessToken(accessToken)) {
      return;
    }

    const response = await axiosInstance.get(`articles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    articles.value = response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};
onMounted(fetchArticles);
onMounted(fetchClient);
</script>



<template>
  <!-- ERROR MESSAGE -->
  <div v-if="showMessage" class="absolute z-50 inset-0 flex items-center justify-center backdrop-blur-lg">
    <div class="bg-card p-12 rounded-lg shadow-inner-strong text-white">
      <p class="text-md text-center font-bold text-warning">Session expired. Redirecting...</p>
      <p class="text-center text-xs text-tGray">Returning to homepage in {{ countdown }} seconds</p>
    </div>
  </div>
  <!-- LOADING -->
  <section v-if="loading" class="min-h-full flex items-center justify-center">
    <div class="text-center flex items-center justify-center">
      <svg class="h-12 w-12" viewBox="0 0 24 24">
        <circle class="animate-pulse" cx="12" cy="12" r="10" stroke="#6aebc8" stroke-width="4" fill="#27C499">
        </circle>
      </svg>
      <p class="text-white mx-1 font-extrabold text-center">Loading</p>
    </div>
  </section>

  <div v-else>
    <!-- Jumbotron -->
    <div class="flex flex-col items-center">
      <div class="px-24 text-white pt-24 mb-16">
        <h1 class="mt-10 text-4xl font-bold mb-1">Welcome to ETech Store</h1>
        <p class="text-xl mb-6 text-tDarkGray">Discover the latest in technology and gadgets</p>
        <div class="flex justify-center">
          <button
            class="mx-2 bg-white text-primary font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition duration-300">
            Discover more
          </button>
          <button
            class="mx-2 bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition duration-300">
            About us
          </button>
        </div>
      </div>

    </div>

    <!-- MAIN CONTENT -->
    <!-- CARD ARTICLES -->
    <div class="min-h-full pb-16 flex items-center justify-center">

      <div class=" grid grid-cols-1 bigSmartphone:grid-cols-2 laptop:grid-cols-3 gap-8">
        <CardArticle v-for="article in articles" :key="article.id" :article="article" />
      </div>
    </div>
  </div>


</template>
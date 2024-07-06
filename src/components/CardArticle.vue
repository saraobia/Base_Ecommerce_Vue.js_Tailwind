<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const accessToken = localStorage.getItem('accessToken');
const idClient = localStorage.getItem('idClient');

const router = useRouter();

const navigateToDetails = () => {
  router.push({ name: 'articleDetails', params: { id: props.article.idArticle } });
};

const addArticleToCart = async (event) => {
  event.stopPropagation();
  try {
    const idClient = localStorage.getItem('idClient');
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      router.push('/');
      return;
    }
    const response = await axiosInstance.post(`cart/${idClient}/${props.article.idArticle}/1`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 200) {
      // Increment cart count
      let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
      cartCount++;
      localStorage.setItem('cartCount', cartCount.toString());

      localStorage.setItem('idCart', response.data);
      console.log(response.data);

      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    console.error('Error with post:', error);
  }
};
</script>

<template>
  <div @click="navigateToDetails"
    class="card bg-card rounded-2xl text-white w-80 h-104 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
    <div class="w-36">
      <img :src="article.imagePath" :alt="article.nameArticle" class=" mb-4">
    </div>
    <div class="w-56">
      <h2 class="text-xl font-bold mb-2">{{ article.nameArticle }}</h2>
      <p class="text-tGray text-sm mb-4">{{ article.description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-green-600">${{ article.price }}</span>
        <span class="text-sm text-tGray">Quantity Available: {{ article.availableQuantity }}</span>
      </div>
      <button @click="addArticleToCart"
        class="text-sm font-bold bg-primary px-4 py-3 rounded-xl w-full mt-4 hover:shadow-inner-strong">Add to
        cart</button>
    </div>
  </div>
</template>
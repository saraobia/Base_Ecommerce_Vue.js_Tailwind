<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/composable/cart';

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const { addToCart } = useCart();

const navigateToDetails = () => {
  router.push({ name: 'SinglePage', params: { id: props.article.idArticle } });
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

    await addToCart(idClient, props.article.idArticle, 1);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};


</script>

<template>
  <div @click="navigateToDetails"
    class="card bg-card rounded-2xl text-white w-80 h-104 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out">
    <!-- HEADER CARD -->
    <div class="mb-8 text-center">
      <h2 class="text-xl font-bold mb-1">{{ article.nameArticle }}</h2>
      <p class="text-tDarkGray text-sm">{{ article.feature }}</p>
    </div>

    <!-- IMG -->
    <div class="mb-8">
      <img :src="article.imagePath" :alt="article.nameArticle" class="h-36">
    </div>
    <div class="w-56">
      <div class="mb-4 text-center">
        <p class="text-sm">$<span class="text-lg font-bold text-tGray">{{ formatPrice(article.price) }}</span></p>
      </div>
      <div class="flex items-center justify-between">

        <button @click="addArticleToCart"
          class="text-sm w-full font-bold bg-primary px-6 py-3 rounded-3xl hover:shadow-inner-strong ">Add to
          cart</button>
      </div>

    </div>
  </div>
</template>

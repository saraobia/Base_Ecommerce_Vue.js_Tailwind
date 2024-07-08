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

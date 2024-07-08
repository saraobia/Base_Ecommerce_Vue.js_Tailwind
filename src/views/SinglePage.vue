<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import { useCart } from '@/composable/cart';

const { addToCart, updateCartCount } = useCart();

const route = useRoute();
const router = useRouter();
const idArticle = route.params.id;
const article = ref(null);
const loading = ref(true);
const quantity = ref(1);

const fetchArticleDetails = async () => {
  try {
    const response = await axiosInstance.get(`article/${idArticle}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    article.value = response.data;
  } catch (error) {
    console.error('Error fetching article details:', error);
  } finally {
    loading.value = false;
  }
};

const addArticleToCart = async () => {
  try {
    const idClient = localStorage.getItem('idClient');
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      router.push('/');
      return;
    }

    const response = await addToCart(idClient, idArticle, quantity.value);

    if (response && response.status === 200) {
      localStorage.setItem('idCart', response.data);

      // Aggiorna il conteggio del carrello nel localStorage
      let currentCartCount = parseInt(localStorage.getItem('cartCount') || '0');
      currentCartCount += quantity.value;
      localStorage.setItem('cartCount', currentCartCount.toString());

      // Aggiorna il conteggio del carrello nel composable
      updateCartCount();

      // Trigger storage event per aggiornare altri componenti
      window.dispatchEvent(new Event('storage'));

      // Redirect to cart page after adding item to cart
      router.push('/cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

onMounted(fetchArticleDetails);
updateCartCount();
</script>

<template>
  <div class="flex items-center justify-center h-screen text-white">
    <div v-if="loading" class="flex items-center justify-center">
      <p>Loading...</p>
    </div>

    <div v-else class="article-details flex flex-col items-center">
      <h1 class="text-4xl font-bold mb-4">{{ article.nameArticle }}</h1>
      <img class="w-104 mb-4" :src="article.imagePath" :alt="article.nameArticle" />
      <p class="mb-4">{{ article.description }}</p>
      <p class="mb-4">Price: ${{ article.price }}</p>
      <p class="mb-4">Available Quantity: {{ article.availableQuantity }}</p>
      <div class="flex items-center mb-4">
        <label for="quantity" class="mr-2">Quantity:</label>
        <input id="quantity" type="number" v-model="quantity" min="1" :max="article.availableQuantity"
          class="bg-background p-1 w-16 text-center" />
      </div>
      <button @click="addArticleToCart" class="bg-primary text-white py-2 px-4 rounded">Add to Cart</button>
    </div>
  </div>
</template>

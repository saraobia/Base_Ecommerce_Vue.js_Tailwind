<script setup>
import { defineProps } from 'vue';
import axiosInstance from '@/axiosInstance';


const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const accessToken = localStorage.getItem('accessToken');
const idClient = localStorage.getItem('idClient');

const idCart = localStorage.getItem('idClient');
console.log(idClient)

const addArticleToCart = async () => {
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
    const response = await axiosInstance.post(`cart/${idClient}/${props.article.idArticle}/1`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 200) {
      // Incrementa il conteggio del carrello
      localStorage.setItem('idCart', response.data);
      console.log(response.data);
      console.log('idCart received:', response.data);
      let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
      cartCount++;
      localStorage.setItem('cartCount', cartCount.toString());
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    console.error('Error with post:', error);
  }
};

const removeArticleToCart = async () => {
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

    const response = await axiosInstance.delete(`cart/${idCart}/article/${props.article.idArticle}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (response.state === 403) {
      console.error('bad request')
    }

    if (response.status === 404) {
      console.log("ERROR: not available cart")
    }

    if (response.status === 200) {
      // Decrementa il conteggio del carrello
      let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
      if (cartCount > 0) {
        cartCount--;
        localStorage.setItem('cartCount', cartCount.toString());
        // Trigger storage event
        window.dispatchEvent(new Event('storage'));
      }
    }
  } catch (error) {
    console.error('Error with delete:', error);
  }
};
</script>

<template>
  <div class="card bg-card rounded-2xl text-white w-80 h-104 flex flex-col items-center justify-center">
    <img :src="article.imagePath" :alt="article.name" class="h-36 object-cover mb-4">
    <div class="w-56">
      <h2 class="text-xl font-bold mb-2">{{ article.nameArticle }}</h2>
      <p class="text-tGray text-sm mb-4">{{ article.description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-green-600">${{ article.price }}</span>
        <span class="text-sm text-tGray">Quantity Available: {{ article.availableQuantity }}</span>
      </div>
      <div class="flex ">
        <button @click="removeArticleToCart"
          class="text-xs border border-primary px-4 py-2 rounded-xl w-full mt-2">Remove</button>
        <button @click="addArticleToCart" class="text-xs bg-primary mx-2 px-4 py-2 rounded-xl w-full mt-2">Add to
          cart</button>
      </div>
    </div>
  </div>
</template>
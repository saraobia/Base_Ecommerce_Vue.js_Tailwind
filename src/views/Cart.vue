<script setup>
import { ref, onMounted, computed } from 'vue';
import axiosInstance from '@/axiosInstance';

const cartItems = ref([]);
const idClient = localStorage.getItem('idClient');

const fetchCartItems = async () => {
  try {
    const response = await axiosInstance.get(`cart/client/${idClient}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    cartItems.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};

const removeItem = async (idCart, idArticle) => {
  try {
    await axiosInstance.delete(`cart/${idCart}/article/${idArticle}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    cartCount = Math.max(cartCount - 1, 0); // Ensure it doesn't go below 0
    localStorage.setItem('cartCount', cartCount.toString());

    // Trigger storage event
    window.dispatchEvent(new Event('storage'));

    await fetchCartItems(); // Refresh cart after removal
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

const createOrder = async () => {
  // Implementa la logica per creare l'ordine
};

const isCartEmpty = computed(() => {
  return cartItems.value.length === 0 || cartItems.value[0].cartArticles.length === 0;
});

onMounted(fetchCartItems);
</script>

<template>
  <div class="text-white h-full pt-24">
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-2xl font-bold mb-4">Your Cart</h1>
      <!-- NO CART FOR CLIENT -->
      <div v-if="isCartEmpty" class="text-center">
        <p>Your cart is empty.</p>
      </div>

      <!-- ITEMS CART -->
      <div v-else>
        <div v-for="cart in cartItems" :key="cart.idCart" class="mb-6">
          <div v-for="item in cart.cartArticles" :key="item.article.idArticle" class="p-4 mb-4">
            <!-- CARD -->
            <div class="flex flex-col items-center justify-between bg-card p-10 rounded-xl">
              <div class="">
                <div class="flex mt-6 items-center w-80 bigSmartphone:w-96">
                  <img :src="item.article.imagePath" :alt="item.article.nameArticle" class="w-36 h-26 p-3 mr-6">
                  <div class="details">
                    <h3 class="text-md font-semibold">{{ item.article.nameArticle }}</h3>
                    <p class="text-xs text-tMiddle">{{ item.article.description }}</p>
                    <p class="mt-4 text-xs text-tGray">Price: ${{ item.article.price }}</p>
                    <p class="text-xs text-tGray">Available in store: {{ item.article.availableQuantity }}</p>
                    <p class="text-xs text-tGray">Quantity ordered: {{ item.quantity }}</p>
                  </div>
                </div>
                <!-- REMOVE -->
                <div class="flex mt-2 justify-end w-full">
                  <div class="flex justify-center items-center">
                    <button @click="removeItem(cart.idCart, item.article.idArticle)"
                      class="bg-danger text-sm text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="cart.cartArticles.length > 0" class="flex flex-col items-end mx-6">
            <p class="text-md font-medium mb-2 text-right">Total Price: ${{ cart.totalPrice }}</p>
            <button @click="createOrder()"
              class="font-bold text-sm bg-primary text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useCart } from '@/composable/cart';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import useAuth from '@/composable/useAuth';

const { showMessage, countdown, checkAccessToken } = useAuth();
const { addToCart, updateCartCount } = useCart();

const accessToken = localStorage.getItem('accessToken');
const route = useRoute();
const router = useRouter();
const idArticle = route.params.id;
const article = ref(null);
const loading = ref(true);
const quantity = ref(1);
const errorMessage = ref('');
const errorCountdown = ref(1);
const showErrorMessage = ref(false);

const updateQuantity = (event) => {
  let newValue = parseInt(event.target.value);
  if (isNaN(newValue) || newValue < 1) {
    quantity.value = 1;
  } else if (newValue > article.value.availableQuantity) {
    quantity.value = article.value.availableQuantity;
    showErrorMessage.value = true;
    errorMessage.value = "Insufficient quantity available. Quantity set to maximum available.";
    errorCountdown.value = 3;
    const interval = setInterval(() => {
      errorCountdown.value--;
      if (errorCountdown.value === 0) {
        clearInterval(interval);
        showErrorMessage.value = false;
      }
    }, 1000);
  } else {
    quantity.value = newValue;
  }
};

const fetchArticleDetails = async () => {
  try {
    if (!checkAccessToken(accessToken)) {
      return;
    }
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

    if (!checkAccessToken(accessToken)) {
      return;
    }

    const response = await addToCart(idClient, idArticle, quantity.value);

    if (response.status === 200) {
      console.log(response);
      updateCartCount();
      window.dispatchEvent(new Event('storage'));
      router.push('/cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error.response && error.response.status === 400) {
      showErrorMessage.value = true;
      errorMessage.value = "Insufficient quantity available. Please reduce the quantity.";
      errorCountdown.value = 3;
      const interval = setInterval(() => {
        errorCountdown.value--;
        console.log(errorCountdown.value);
        if (errorCountdown.value === 0) {
          clearInterval(interval);
          showErrorMessage.value = false;
        }
      }, 1000);
    } else {
      errorMessage.value = "An error occurred while adding to cart.";
    }
  }
};

const incrementQuantity = () => {
  if (quantity.value < article.value.availableQuantity) {
    quantity.value++;
  } else {
    showErrorMessage.value = true;
    errorMessage.value = "Insufficient quantity available. Cannot add more.";
    errorCountdown.value = 3;
    const interval = setInterval(() => {
      errorCountdown.value--;
      if (errorCountdown.value === 0) {
        clearInterval(interval);
        showErrorMessage.value = false;
      }
    }, 1000);
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

onMounted(fetchArticleDetails);
updateCartCount();
</script>

<template>
  <div class="flex items-center justify-center min-h-full text-white py-10">
    <!-- ERROR MESSAGE -->
    <div v-if="showMessage" class="absolute z-50 inset-0 flex items-center justify-center backdrop-blur-lg">
      <div class="bg-card p-12 rounded-lg shadow-inner-strong text-white">
        <p class="text-md text-center font-bold text-warning">Session expired. Redirecting...</p>
        <p class="text-center text-xs text-tGray">Returning to homepage in {{ countdown }} seconds</p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex items-center justify-center">
      <div class="text-center flex items-center justify-center">
        <svg class="h-8 w-8" viewBox="0 0 24 24">
          <circle class="animate-pulse" cx="12" cy="12" r="10" stroke="#6aebc8" stroke-width="4" fill="#27C499">
          </circle>
        </svg>
        <p class="text-white mx-1 font-extrabold text-center">Loading</p>
      </div>
    </div>

    <!-- CARD -->
    <div v-else class="flex flex-col items-center">
      <div
        class="w-96 p-10 rounded-xl flex flex-col justify-center items-center tablet:flex-row tablet:w-200 tablet:pl-0">

        <img class="w-48 mb-8 tablet:w-80 tablet:mb-0 tablet:px-10" :src="article.imagePath" :alt="article.name" />
        <div class="">
          <h1 class="text-4xl font-bold mb-4">{{ article.name }}</h1>
          <p class="mb-1 text-tGray"><span class="font-bold">Features:</span> {{ article.feature }}</p>
          <p class="mb-10 text-tDarkGray text-sm"><span class="font-bold">Description:</span>{{ article.description }}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet necessitatibus nobis nisi delectus
            expedita, voluptatum explicabo deserunt! Laboriosam, temporibus magnam. Dicta ipsa harum minus fugiat?
          </p>
          <div class=" flex flex-col tablet:flex-row justify-between">
            <div class="">
              <p class="mb-1 text-tGray">Price: ${{ formatPrice(article.price * quantity) }}</p>
              <p class="mb-16 text-tGray tablet:mb-0">Available Quantity: {{ article.availableQuantity }}</p>
            </div>

            <!-- QUANTITY -->
            <div class="flex flex-col items-end mb-8">
              <label for="quantity" class="mb-2 mr-1 text-sm text-tMiddle">Select quantity</label>

              <div class="mb-4 bg-card flex items-center rounded-lg tablet:mb-0 ">
                <!-- MINUS -->
                <button @click="decrementQuantity"
                  class="w-8 h-8 rounded-md  text-tGray shadow-inner-strong hover:text-primary">
                  <font-awesome-icon class="" :icon="['fas', 'minus']" />
                </button>

                <!-- NUMBER -->
                <input type="number" v-model="quantity" @input="updateQuantity" min="1" :max="article.availableQuantity"
                  class="w-10 text-center text-lg font-bold bg-card focus:outline-none  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />

                <!-- PLUS -->
                <button @click="incrementQuantity"
                  class="w-8 h-8 text-tGray rounded-md  hover:text-primary shadow-inner-strong ">
                  <font-awesome-icon :icon="['fas', 'plus']" />
                </button>

              </div>
            </div>
          </div>

          <!-- ADD TO CART -->
          <div class="w-full  flex justify-end">
            <button @click="addArticleToCart"
              class="bg-primary text-white py-2 px-8 rounded-full font-bold hover:shadow-inner-strong">
              Add to Cart
            </button>
          </div>
        </div>

        <!-- ERROR QUANTITY MESSAGE -->
        <div v-if="showErrorMessage" class="fixed z-50 inset-0 flex items-center justify-center backdrop-blur-sm">
          <div class="bg-card p-10 rounded-xl text-center">
            <p class="text-danger font-bold text-3xl">Error:</p>
            <p class="text-tGray text-sm mt-4">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
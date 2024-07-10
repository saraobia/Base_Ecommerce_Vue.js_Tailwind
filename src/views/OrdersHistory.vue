<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import CardOrders from '@/components/CardOrder.vue';
import axiosInstance from '@/axiosInstance';
import useAuth from '@/composable/useAuth';

const { showMessage, countdown, checkAccessToken } = useAuth();
const accessToken = localStorage.getItem('accessToken');

const orders = ref(null)
const idClient = localStorage.getItem('idClient');

const router = useRouter();

// GET ORDERS
const fetchOrders = async () => {
  try {
    if (!checkAccessToken(accessToken)) {
      return;
    }
    const response = await axiosInstance.get(`client/orders/${idClient}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    orders.value = response.data;

  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// NO ORDERS
const noOrders = computed(() => {
  return !orders.value || orders.value.length === 0;
});


onMounted(fetchOrders);
</script>

<template>
  <!-- ERROR MESSAGE -->
  <div v-if="showMessage" class="absolute z-50 inset-0 flex items-center justify-center backdrop-blur-lg">
    <div class="bg-card p-12 rounded-lg shadow-inner-strong text-white">
      <p class="text-md text-center font-bold text-warning">Session expired. Redirecting...</p>
      <p class="text-center text-xs text-tGray">Returning to homepage in {{ countdown }} seconds</p>
    </div>
  </div>

  <!-- CARDS -->
  <section class="min-h-full py-20 text-white flex flex-col items-center justify-center">
    <h1 class="font-bold text-2xl text-white my-6">Your Orders</h1>
    <!-- NO ORDER FOR CLIENT -->
    <div v-if="noOrders">
      <div class="bg-card p-20 rounded-lg flex flex-col items-center">
        <p class="text-tDarkGray text-sm">We are sorry but you haven't any orders </p>
        <button @click="router.push('/home')"
          class="mt-4 font-bold text-sm bg-primary text-white px-4 py-3 rounded-full hover:shadow-inner-strong">
          Back to the articles
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 tablet:grid-cols-2 gap-10 laptop:grid-cols-3">
      <CardOrders v-for="order in orders" :key="order.idOrder" :order="order" />
    </div>
  </section>
</template>
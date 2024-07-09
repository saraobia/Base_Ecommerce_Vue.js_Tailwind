<script setup>
import { ref, onMounted } from 'vue';
import CardOrders from '@/components/CardOrder.vue';
import axiosInstance from '@/axiosInstance';
import useAuth from '@/composable/useAuth';

const { showMessage, countdown, checkAccessToken } = useAuth();
const accessToken = localStorage.getItem('accessToken');

const orders = ref(null)
const idClient = localStorage.getItem('idClient');

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
  <section class="py-20 text-white flex flex-col items-center justify-center">
    <h1 class="font-bold text-xl text-primary my-6">My Orders</h1>
    <div class="grid grid-cols-2 gap-10">
      <CardOrders v-for="order in orders" :key="order.idOrder" :order="order" />
    </div>
  </section>
</template>
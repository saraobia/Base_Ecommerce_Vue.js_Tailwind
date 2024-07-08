<script setup>
import { ref, onMounted } from 'vue';
import CardOrders from '@/components/CardOrder.vue';
import axiosInstance from '@/axiosInstance';


const accessToken = localStorage.getItem('accessToken');

const orders = ref(null)
const idClient = localStorage.getItem('idClient');

// GET ORDERS
const fetchOrders = async () => {
  try {
    if (!accessToken) {
      handleMissingAccessToken();
      return;
    }

    const response = await axiosInstance.get(`client/orders/${idClient}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    orders.value = response.data;
    console.log(orders.value);


  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// MISSING ACCESS TOKEN
const handleMissingAccessToken = () => {
  showMessage.value = true;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(interval);
      router.push('/');
    }
  }, 1000);
};

onMounted(fetchOrders);
</script>

<template>
  <section class="py-20 text-white flex flex-col items-center justify-center">
    <h1 class="font-bold text-xl text-primary my-6">My Orders</h1>
    <div class="grid grid-cols-2 gap-10">
      <CardOrders v-for="order in orders" :key="order.idOrder" :order="order" />
    </div>
  </section>
</template>
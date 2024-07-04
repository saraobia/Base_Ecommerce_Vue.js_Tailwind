<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/axiosInstance';
import PrenotationCard from '@/components/PrenotationCard.vue';
import { useRouter } from 'vue-router';

const orderDetails = ref([]);
const idClient = localStorage.getItem('idClient');
const accessToken = localStorage.getItem('accessToken');
const showMessage = ref(false);
const countdown = ref(5);
const router = useRouter();

const fetchOrders = async () => {
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

    const response = await axiosInstance.get(`orders/${idClient}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (response.status === 200) {
      orderDetails.value = response.data;
      console.log('Fetched orders:', orderDetails.value);
    } else {
      console.error('Failed to fetch orders:', response);
      orderDetails.value = [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    orderDetails.value = [];
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <!-- Messaggio di errore -->
    <div v-if="showMessage" class="absolute z-50 inset-0 flex items-center justify-center backdrop-blur-lg">
      <div class="bg-white p-12 rounded-lg shadow-lg">
        <p class="text-md text-center font-bold text-warning">Session expired. Redirecting...</p>
        <p class="text-center text-xs text-darkGray">Returning to homepage in {{ countdown }} seconds</p>
      </div>
    </div>

    <!-- CARD PRENOTATION -->
    <div>
      <PrenotationCard :orderDetails="orderDetails" />
    </div>
  </div>
</template>

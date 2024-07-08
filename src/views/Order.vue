<script setup>
import { ref, computed, onMounted } from 'vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import axiosInstance from '@/axiosInstance';

const route = useRoute();
const accessToken = localStorage.getItem('accessToken');
const order = ref(null);

const formattedOrderDate = computed(() => {
  return order.value?.orderDetail?.orderDate
    ? moment(order.value.orderDetail.orderDate).format('MMMM Do YYYY, h:mm:ss a')
    : '';
});

// GET ORDER
const fetchOrder = async () => {
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
    const idOrder = route.params.id;
    console.log(idOrder)
    const response = await axiosInstance.get(`order/${idOrder}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("Dati ricevuti dall'API:", response.data);
    order.value = response.data;
    if (response.data && response.data.client) {
      order.value = response.data;
    } else {
      throw new Error('Invalid order data received');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
  }
};

// const confirmAndPayOrder = () {

// }

onMounted(fetchOrder);
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center text-white">
    <div v-if="order" class="bg-card p-10 rounded-xl w-80">
      <h2 class="text-2xl font-extrabold mb-4 text-primary">Order Summary</h2>
      <!-- ORDER-->
      <div class="flex flex-col justify-center mb-4">
        <p><strong>Order n°:</strong> {{ order.idOrder }}</p>
        <p class="text-xs"><strong>Date:</strong> {{ formattedOrderDate }}</p>
      </div>
      <!-- CLIENT-->
      <div class="flex flex-col mb-4">
        <h6 class="font-bold">Your data:</h6>
        <p class="text-xs"><strong>Client:</strong> {{ order.client.name }} {{ order.client.surname }}</p>
        <p class="text-xs"><strong>Email:</strong> {{ order.client.email }}</p>
      </div>
      <!-- ORDER DETAILS -->
      <div class="mt-10">
        <h3 class="text-lg font-semibold mb-2">Order Details</h3>
        <div v-for="item in order.orderDetail.orderDetailArticles" :key="item.id">
          <div class="flex flex-col justify-between  mb-2">
            <p class="text-xs">{{ item.article.nameArticle }}</p>
            <p class="text-xs">Quantity: {{ item.quantity }}</p>
            <p class="text-xs">Price: ${{ item.article.price }}</p>
          </div>
        </div>
        <p class="text-md font-semibold mt-4 text-right">Total Price:</p>
        <p class="text-right font-black">${{ order.orderDetail.totalPrice }}</p>
      </div>
      <div class="mt-10 flex justify-between">
        <button @click="CancelOrder()"
          class="font-bold text-sm bg-danger text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
          Cancel
        </button>
        <button @click="confirmAndPayOrder()"
          class="font-bold text-sm bg-primary text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
          Confirm and pay
        </button>
      </div>
    </div>
  </div>
</template>
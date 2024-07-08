<template>
  <div class="">
    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
    <div class="flex justify-between items-center mb-4">
      <p><strong>Order ID:</strong> {{ order.idOrder }}</p>
      <p><strong>Order Date:</strong> {{ formattedOrderDate }}</p>
    </div>
    <div class="flex justify-between items-center mb-4">
      <p><strong>Client:</strong> {{ order.client.name }} {{ order.client.surname }}</p>
      <p><strong>Email:</strong> {{ order.client.email }}</p>
    </div>
    <div class="">
      <h3 class="text-lg font-semibold mb-2">Order Details</h3>
      <div v-for="item in order.orderDetail.orderDetailArticles" :key="item.id">
        <div class="flex justify-between items-center mb-2">
          <p>{{ item.article.nameArticle }}</p>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: ${{ item.article.price }}</p>
        </div>
      </div>
      <p class="text-lg font-semibold mt-4">Total Price: ${{ order.totalPrice }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import moment from 'moment'; // Importa moment per formattare la data

const props = defineProps({
  order: Object, // Riceve l'oggetto ordine come prop
});

const formattedOrderDate = computed(() => {
  return moment(props.order.orderDetail.orderDate).format('MMMM Do YYYY, h:mm:ss a');
});
</script>

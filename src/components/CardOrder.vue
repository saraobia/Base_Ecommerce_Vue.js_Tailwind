<script setup>
import moment from 'moment';
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

// FORMATTED DATE
const formattedOrderDate = computed(() => {
  return props.order.orderDetail?.orderDate
    ? moment(props.order.orderDetail.orderDate).format('MMMM Do YYYY, h:mm:ss a')
    : '';
});

</script>

<template>
  <div class="bg-card p-10 rounded-xl">
    <div class="flex flex-col justify-center mb-4">
      <p><strong>Order n°:</strong> {{ props.order.idOrder }}</p>
      <p class="text-xs"><strong>Date:</strong> {{ formattedOrderDate }}</p>
    </div>

    <!-- ORDER DETAILS -->
    <div class="mt-10">
      <h3 class="text-lg font-semibold mb-2">Order Details</h3>
      <div v-for="item in props.order.orderDetail?.orderDetailArticles" :key="item.id">
        <div class="flex flex-col justify-between mb-2">
          <p class="text-xs">{{ item.article?.nameArticle }}</p>
          <p class="text-xs">Quantity: {{ item.quantity }}</p>
          <p class="text-xs">Price: ${{ item.article?.price }}</p>
        </div>
      </div>
      <p class="text-md font-semibold mt-4 text-right">Total Price:</p>
      <p class="text-right font-black">${{ props.order.orderDetail?.totalPrice }}</p>
    </div>
  </div>
</template>
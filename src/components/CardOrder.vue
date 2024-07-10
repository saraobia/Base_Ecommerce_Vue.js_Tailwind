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
      <h6 class="text-xl mb-1"><strong>Order n°:</strong> {{ props.order.idOrder }}</h6>
      <p class="text-xs text-tDarkGray"><strong>Date:</strong> {{ formattedOrderDate }}</p>
    </div>

    <!-- ORDER DETAILS -->
    <div class="mt-10 text-tDarkGray">
      <h3 class="text-white text-lg font-semibold mb-2">Order Details</h3>
      <div v-for="item in props.order.orderDetail?.orderDetailArticles" :key="item.id">
        <div class="flex flex-col justify-between mb-2">
          <p class="mb-1 text-xs text-tGray font-bold">{{ item.article?.name }}</p>
          <p class="mb-1 text-xs">Quantity: {{ item.quantity }}</p>
          <p class="text-xs">Price: ${{ item.article?.price }}</p>
        </div>
      </div>
      <p class="text-sm font-semibold mt-4 text-right ">Total Price:</p>
      <p class="text-white text-right font-black">${{ props.order.orderDetail?.totalPrice }}</p>
    </div>
  </div>
</template>
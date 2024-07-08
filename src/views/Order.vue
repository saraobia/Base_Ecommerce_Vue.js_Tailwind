<script setup>
import { ref, computed, onMounted } from 'vue';
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import PaymentForm from '@/components/PaymentForm.vue';

const isLoading = ref(false); // Inizialmente false
const isContentVisible = ref(true);

const route = useRoute();
const router = useRouter();

const accessToken = localStorage.getItem('accessToken');

const order = ref(null);

// CONTENTS TO SHOW
const showMessageForAnnulled = ref(false);
const annulledMessage = ref('');
const showPaymentForm = ref(false);
const showOrderContent = ref(true);
const showMessageOrderCompleted = ref(false);
const orderMessage = ref('');

// SHOW MESSAGE
const showOrderCompletedMessage = (message) => {
  isContentVisible.value = false; // Nascondi tutto il contenuto
  setTimeout(() => {
    isLoading.value = true; // Mostra il loading dopo un breve delay
    setTimeout(() => {
      showMessageOrderCompleted.value = true;
      orderMessage.value = message;
      isLoading.value = false; // Nascondi il loading
    }, 2000); // Mostra il loading per 2 secondi, puoi aggiustare questo valore
  }, 300); // Piccolo delay per permettere la transizione del contenuto
}
// ERROR MESSAGE
const showOrderErrorMessage = (errorMessage) => {
  isContentVisible.value = false;
  setTimeout(() => {
    showMessageOrderCompleted.value = true;
    orderMessage.value = errorMessage;
  }, 300);
}

// FORMATTED DATE
const formattedOrderDate = computed(() => {
  return order.value?.orderDetail?.orderDate
    ? moment(order.value.orderDetail.orderDate).format('MMMM Do YYYY, h:mm:ss a')
    : '';
});

// GET ORDER
const fetchOrder = async () => {
  try {
    if (!accessToken) {
      handleMissingAccessToken();
      return;
    }
    const idOrder = route.params.id;
    console.log(idOrder)
    const response = await axiosInstance.get(`order/${idOrder}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    order.value = response.data;
    showOrderContent.value = true;
    if (response.data && response.data.client) {
      order.value = response.data;
    } else {
      throw new Error('Invalid order data received');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
  } finally {
    isLoading.value = false;
  }
};

// CANCEL ORDER
const cancelOrder = async () => {
  try {
    isLoading.value = true;
    if (!accessToken) {
      handleMissingAccessToken();
      return;
    }
    const idOrder = route.params.id;
    console.log(idOrder)
    await axiosInstance.patch(`state/${idOrder}`,
      {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("status changed");
    showMessageForAnnulled.value = true;
    annulledMessage.value = 'Order canceled successfully!';
  } catch (error) {
    console.error('Error during change status', error);
    annulledMessage.value = 'Something went wrong!';
    showMessageForAnnulled.value = true;
  } finally {
    isLoading.value = false;
  }
}

//CONFIRM AND PAY
const confirmOrder = () => {
  showPaymentForm.value = true;
}

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

onMounted(fetchOrder);
</script>

<template>

  <div v-if="isContentVisible">
    <div class="py-20 flex flex-col items-center justify-center text-white">
      <div class="bg-card p-10 rounded-xl w-80 bigSmartphone:w-96 tablet:w-112 laptop:w-128">
        <div v-if="isLoading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div v-if="!showMessageForAnnulled">
            <div v-if="order">
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
                <button @click="cancelOrder()"
                  class="font-bold text-sm bg-danger text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
                  Cancel
                </button>
                <button @click="confirmOrder()"
                  class="font-bold text-sm bg-primary text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
                  Confirm
                </button>
              </div>
              <div v-if="showPaymentForm">
                <PaymentForm :idOrder="order.idOrder" :isLoading="isLoading" @orderCompleted="showOrderCompletedMessage"
                  @orderError="showOrderErrorMessage" />
              </div>
            </div>

            <div v-else>
              <p>Loading order...</p>
            </div>

            <div v-if="showMessageOrderCompleted" class="mt-4">
              <p class="text-lg font-bold text-primary">{{ orderMessage }}</p>
            </div>
          </div>

          <div v-else>
            <h2 class=" text-2xl font-extrabold mb-4 text-primary">Order status</h2>
            <p class="text-lg">{{ annulledMessage }}</p>
            <button @click="router.push('/home')"
              class="mt-4 font-bold text-sm bg-primary text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
              Back to the articles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="h-screen flex items-center justify-center">
    <div class="text-center flex items-center justify-center">
      <svg class="h-8 w-8" viewBox="0 0 24 24">
        <circle class="animate-pulse" cx="12" cy="12" r="10" stroke="#61a4ad" stroke-width="4" fill="#07575b">
        </circle>
      </svg>
      <p class="text-middle mx-1 font-extrabold text-center">Loading</p>
    </div>
  </div>

  <div v-else-if="showMessageOrderCompleted" class="h-full flex items-center justify-center">
    <div class="p-20 bg-card flex flex-col items-center justify-center rounded-xl">
      <p class="text-lg font-medium text-tGray">{{ orderMessage }}</p>
      <div class="">
        <button @click="router.push('/home')"
          class=" bg-card shadow-inner-strong mx-2  mt-4 font-bold text-sm  text-primary px-4 py-2 rounded-xl hover:shadow-inner-strong">
          Back to the articles
        </button>

        <button @click="router.push('/orders-history')"
          class="mx-2 mt-4 font-bold text-sm bg-primary text-white px-4 py-2 rounded-xl hover:shadow-inner-strong">
          View orders
        </button>
      </div>
    </div>
  </div>

</template>

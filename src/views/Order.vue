<script setup>
import { ref, computed, onMounted } from 'vue';
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import PaymentForm from '@/components/PaymentForm.vue';
import useAuth from '@/composable/useAuth';

const { showMessage, countdown, checkAccessToken } = useAuth();

const isLoading = ref(false);
const isContentVisible = ref(true);

const route = useRoute();
const router = useRouter();

const accessToken = localStorage.getItem('accessToken');

const order = ref(null);

const showButtons = ref(true);

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
    if (!checkAccessToken(accessToken)) {
      return;
    }
    const idOrder = route.params.id;
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
    if (!checkAccessToken(accessToken)) {
      return;
    }
    const idOrder = route.params.id;
    await axiosInstance.patch(`state/${idOrder}`,
      {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
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

// CONFIRM ORDER ANH HIDE BTNS
const confirmOrder = () => {
  showPaymentForm.value = true;
  showButtons.value = false;
}
onMounted(fetchOrder);
</script>

<template>
  <!-- ERROR MESSAGE -->
  <div v-if="showMessage" class="absolute z-50 inset-0 flex items-center justify-center backdrop-blur-lg">
    <div class="bg-card p-12 rounded-lg shadow-inner-strong text-white">
      <p class="text-md text-center font-bold text-warning">Session expired. Redirecting...</p>
      <p class="text-center text-xs text-tGray">Returning to homepage in {{ countdown }} seconds</p>
    </div>
  </div>

  <div v-if="isContentVisible">
    <!-- CARD ORDER-->
    <div class="py-20 flex flex-col items-center justify-center text-white min-h-full">
      <div class="bg-card p-10 rounded-xl w-88 bigSmartphone:w-96 tablet:w-112 laptop:w-128">
        <div v-if="isLoading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <div v-if="!showMessageForAnnulled">
            <div v-if="order">
              <div class="flex flex-col justify-center mb-10">
                <p class="mb-1 text-2xl"><strong>Order n°:</strong> {{ order.idOrder }}</p>
                <p class="text-tDarkGray text-xs"><strong>Date:</strong> {{ formattedOrderDate }}</p>
              </div>

              <!-- CLIENT-->
              <div class="flex flex-col mb-10">
                <h6 class="font-bold mb-2">Your data:</h6>
                <p class="text-xs mb-1 text-tDarkGray"><strong>Client:</strong> {{ order.client.name }} {{
    order.client.surname }}</p>
                <p class="text-xs text-tDarkGray"><strong>Email:</strong> {{ order.client.email }}</p>
              </div>
              <!-- ORDER DETAILS -->
              <div>
                <h3 class="text-lg font-semibold mb-2">Order Details</h3>
                <div v-for="item in order.orderDetail.orderDetailArticles" :key="item.id">
                  <div class="flex flex-col justify-between  mb-2">
                    <p class="text-xs font-bold text-tGray mb-1">{{ item.article.name }}</p>
                    <p class="text-xs text-tDarkGray mb-1">Quantity: {{ item.quantity }}</p>
                    <p class="text-xs text-tDarkGray">Price: ${{ item.article.price }}</p>
                  </div>
                </div>
                <p class="text-md font-semibold mt-4 text-right">Total Price:</p>
                <p class="text-right font-black mb-6">${{ order.orderDetail.totalPrice }}</p>
              </div>

              <div v-if="showButtons" class=" flex justify-between w-full">
                <!-- BUTTONS -->
                <button @click="cancelOrder()"
                  class="font-bold text-sm bg-danger text-white px-4 py-2 rounded-full hover:shadow-inner-strong">
                  Cancel
                </button>
                <button @click="confirmOrder()"
                  class="font-bold text-sm bg-primary text-white px-4 py-2 rounded-full hover:shadow-inner-strong">
                  Confirm
                </button>


              </div>

              <!-- PAYMENT -->
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
            <h2 class="text-2xl font-extrabold mb-1 text-white">Order status</h2>
            <p class="text-sm text-tDarkGray">{{ annulledMessage }}</p>
            <div class="flex w-full justify-end items-end">
              <button @click="router.push('/home')"
                class="mt-4 font-bold text-sm bg-primary text-white px-4 py-2 rounded-full hover:shadow-inner-strong">
                Back to the articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- LOADING AFTER PAYMENT -->
  <div v-else-if="isLoading" class="h-screen flex items-center justify-center">
    <div class="text-center flex items-center justify-center">
      <svg class="h-12 w-12" viewBox="0 0 24 24">
        <circle class="animate-pulse" cx="12" cy="12" r="10" stroke="#6aebc8" stroke-width="4" fill="#27C499">
        </circle>
      </svg>
      <p class="text-white mx-1 font-extrabold text-center">Loading</p>
    </div>
  </div>

  <!-- MESSAGE OPERATION COMPLETED -->
  <div v-else-if="showMessageOrderCompleted" class=" min-h-full flex items-center justify-center">
    <div class="p-20 bg-card flex flex-col items-center justify-center rounded-xl">
      <p class="text-lg  text-tDarkGray">{{ orderMessage }}</p>
      <div class="">
        <button @click="router.push('/home')"
          class="bg-card shadow-inner-strong mx-2  mt-4  text-sm font-bold text-white px-5 py-3 rounded-full hover:shadow-inner-strong hover:bg-primary">
          Back to the articles
        </button>

        <button @click="router.push('/orders-history')"
          class="mx-2 mt-4 font-bold text-sm bg-primary text-white px-5 py-3 rounded-full hover:shadow-inner-strong">
          View orders
        </button>
      </div>
    </div>
  </div>

</template>

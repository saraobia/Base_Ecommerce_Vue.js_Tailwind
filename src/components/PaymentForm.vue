<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axiosInstance from '@/axiosInstance';
import { useRouter } from 'vue-router';

const emit = defineEmits(['orderCompleted', 'orderError']);

const payment = ref('');
const accessToken = localStorage.getItem('accessToken');
const router = useRouter();

const props = defineProps({
  idOrder: {
    type: Number,
    required: true
  },
  isLoading: Boolean  // Define isLoading as a prop
});

const selectPayment = (type) => {
  payment.value = type;
  console.log(payment.value);
}

const handleSubmitPayment = async () => {
  try {
    if (!accessToken) {
      handleMissingAccessToken();
      return;
    }
    // Set isLoading to true to start loading state
    emit('update:isLoading', true);

    await axiosInstance.post(`order/${props.idOrder}`,
      { paymentType: payment.value },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

    console.log("id order " + props.idOrder);
    console.log("Order completed");
    emit('orderCompleted', 'Order completed successfully');

  } catch (error) {
    console.error("Error during the order" + error);
    emit('orderError', 'An error occurred while processing the order');
  }
}

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
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmitPayment">
      <!-- TYPE OF PAYMENT -->
      <div class="mb-8 text-sm">
        <label for="payment" class="text-tDarkGray font-medium">Select the type of payment:</label>

        <div class="grid grid-cols-2 gap-2 mt-2 text-darkGray">
          <!-- CREDIT CARD -->
          <div @click="selectPayment('CREDIT_CARD')"
            :class="{ 'bg-primary shadow-inner-strong text-white': payment === 'CREDIT_CARD', 'bg-': payment !== 'CREDIT_CARD' }"
            class="bg-card shadow-inner-strong  px-3 py-3 flex items-center justify-center rounded-lg cursor-pointer focus:outline-none hover:bg-primary">
            <font-awesome-icon :icon="['fas', 'credit-card']" class="text-xl text-icon-gray" />
            <span class="ml-2">Credit card</span>
          </div>

          <!-- PAYPAL -->
          <div @click="selectPayment('PAYPAL')"
            :class="{ 'bg-primary text-white': payment === 'PAYPAL', 'bg-card': payment !== 'PAYPAL' }"
            class="bg-card shadow-inner-strong px-3 py-3 flex items-center justify-center cursor-pointer rounded-lg focus:outline-none hover:bg-primary">
            <font-awesome-icon :icon="['fab', 'paypal']" class="text-xl text-icon-gray" />
            <span class="ml-2">PayPal</span>
          </div>

          <!-- GOOGLE PAY -->
          <div @click="selectPayment('GOOGLE_PAY')"
            :class="{ 'bg-primary text-white': payment === 'GOOGLE_PAY', 'bg-card': payment !== 'GOOGLE_PAY' }"
            class="bg-card shadow-inner-strong px-3 py-3 flex items-center justify-center cursor-pointer rounded-lg focus:outline-none hover:bg-primary">
            <font-awesome-icon :icon="['fab', 'google-pay']" class="text-xl text-icon-gray" />
            <span class="ml-2 items-center">Google pay</span>
          </div>

          <!-- BANK TRANSFER -->
          <div @click="selectPayment('BANK_TRANSFER')"
            :class="{ 'bg-primary text-white': payment === 'BANK_TRANSFER', 'bg-card': payment !== 'BANK_TRANSFER' }"
            class="bg-card shadow-inner-strong px-3 py-3 flex items-center justify-center rounded-lg cursor-pointer focus:outline-none hover:bg-primary active:bg-primary">
            <font-awesome-icon :icon="['fas', 'money-bill-transfer']" />
            <span class="ml-2">Bank transf</span>
          </div>
        </div>
        <div class="flex justify-end w-full">
          <button @click="handleSubmitPayment"
            class="mt-4 font-bold text-sm bg-primary text-white px-4 py-2 rounded-full active:bg-primary"
            :disabled="!payment">
            Pay
          </button>
        </div>
      </div>
    </form>

    <section v-if="props.isLoading" class="h-screen flex items-center justify-center">
      <div class="text-center flex items-center justify-center">
        <svg class="h-8 w-8" viewBox="0 0 24 24">
          <circle class="animate-pulse" cx="12" cy="12" r="10" stroke="#61a4ad" stroke-width="4" fill="#07575b">
          </circle>
        </svg>
        <p class="text-middle mx-1 font-extrabold text-center">Loading</p>
      </div>
    </section>
  </div>
</template>

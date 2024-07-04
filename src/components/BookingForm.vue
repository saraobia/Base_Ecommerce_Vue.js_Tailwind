<script setup>
import { ref, defineEmits } from 'vue';
import axiosInstance from '@/axiosInstance';

const props = defineProps({
  idFlight: String,
  ticketPrice: Number,
  places: Number,
  bookingConfirmed: Boolean
});
const emits = defineEmits(['update:bookingConfirmed']);

const accessToken = localStorage.getItem('accessToken');
const idClient = localStorage.getItem('idClient');
const passengers = ref(1);
const payment = ref('');

console.log(props.idFlight);
console.log(props.places);
console.log(props.ticketPrice);




// POST FORM
const handleSubmitBookFlight = async () => {
  try {
    const response = await axiosInstance.post(`/${idClient}/${props.idFlight}/${passengers.value}/${payment.value}`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    // Emetti un evento per notificare al genitore che la prenotazione è confermata
    emits('update:bookingConfirmed', true);
    console.log('Flight booked successfully:', response.data);
  } catch (error) {
    console.error('Error fetching flights:', error);
  }
};
// FUNCTION TO CALCULATE THE TOTAL PRICE
const calculateTotalPrice = ref(() => {
  return props.ticketPrice * passengers.value;
});

// COUNTER FUNCTION TO ADD AND REMOVE PASSENGERS
const handleAddPassenger = () => {
  if (passengers.value < props.places) {
    passengers.value++;
  }


};

const handleRemovePassenger = () => {
  if (passengers.value > 1) {
    passengers.value--;
  }
};

const selectPayment = (type) => {
  payment.value = type;
}
</script>

<template>

  <div class="p-4">
    <div class="w-96 h-112 mx-auto bg-white p-8 rounded-lg shadow-lg bigSmartphone:w-96 laptop:w-112">
      <h1 class="text-2xl font-medium text-dark text-center mb-4">Booking <span
          class="font-bold text-middle">Details</span> </h1>
      <!-- FORM -->
      <form @submit.prevent="handleSubmitBookFlight">

        <!-- NUMB OF PASSENGERS -->
        <div class="mb-6 flex flex-col ">
          <label for="passengers" class=" text-lightGray font-semibold text-sm mb-4">Passengers:</label>
          <div class=" flex items-center ">
            <input type="number" id="passengers" v-model="passengers" min="1"
              class="w-14 text-center bg-white text-darkGray text-xl font-extrabold active:outline-none focus:outline-none  "
              required :readonly="true" />

            <!-- MINUS -->
            <div class="cursor-pointer" @click="handleRemovePassenger">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="#61a4ad" class="size-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

            </div>
            <!-- PLUS -->
            <div @click="handleAddPassenger" class="h-8 w-8 p-2 bg-light rounded-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white"
                class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>

          </div>
        </div>

        <!-- TYPE OF PAYMENT -->
        <div class="mb-8 text-sm">
          <label for="payment" class=" text-lightGray font-semibold">Select the type of payment:</label>

          <div class="grid grid-cols-2 gap-2 mt-2 text-darkGray">

            <!-- CREDIT CARD -->
            <div @click="selectPayment('CREDIT_CARD')"
              :class="{ 'bg-light shadow-lg text-white': payment === 'CREDIT_CARD', 'shadow-xl': payment !== 'CREDIT_CARD' }"
              class="p-4 flex items-center justify-center rounded-lg cursor-pointer focus:outline-none hover:bg-light hover:text-white">
              <font-awesome-icon :icon="['fas', 'credit-card']" class="text-xl text-icon-gray" />
              <span class="ml-2">Credit card</span>
            </div>

            <!-- PAYPAL -->
            <div @click="selectPayment('PAYPAL')"
              :class="{ 'bg-light shadow-lg text-white': payment === 'PAYPAL', 'shadow-xl': payment !== 'PAYPAL' }"
              class="p-4 flex items-center justify-center cursor-pointer  rounded-lg focus:outline-none hover:bg-light hover:text-white">
              <font-awesome-icon :icon="['fab', 'paypal']" class="text-xl text-icon-gray" />
              <span class="ml-2">PayPal</span>
            </div>


            <!-- GOOGLE PAY -->
            <div @click="selectPayment('GOOGLE_PAY')"
              :class="{ 'bg-light shadow-lg text-white': payment === 'GOOGLE_PAY', 'shadow-xl': payment !== 'GOOGLE_PAY' }"
              class="p-4 flex items-center justify-center cursor-pointer rounded-lg focus:outline-none hover:bg-light hover:text-white">
              <font-awesome-icon :icon="['fab', 'google-pay']" class="text-xl text-icon-gray " />
              <span class="ml-2 items-center">Google pay</span>
            </div>

            <!-- BANK TRANSFER -->
            <div @click="selectPayment('BANK_TRANSFER')"
              :class="{ 'bg-light shadow-lg text-white': payment === 'BANK_TRANSFER', 'shadow-xl': payment !== 'BANK_TRANSFER' }"
              class="p-4 flex items-center justify-center rounded-lg cursor-pointer focus:outline-none hover:bg-light  hover:text-white">
              <font-awesome-icon :icon="['fas', 'money-bill-transfer']" />
              <span class="ml-2">Bank transfer</span>
            </div>
          </div>

        </div>

        <!-- TOTAL PRICE -->

        <div class=" flex justify-between">
          <div>
            <label for="comments" class=" text-base block font-bold text-dark ">Total Price:</label>

            <div id="totalPrice" class="text-darkGray font-extrabold">{{ calculateTotalPrice() }} $</div>
          </div>

          <button type="submit"
            class="bg-light text-white px-4 py-2 rounded-lg hover:bg-middle shadow-xl focus:outline-none  ">
            Book Tickets
          </button>
        </div>



      </form>
    </div>
  </div>
</template>

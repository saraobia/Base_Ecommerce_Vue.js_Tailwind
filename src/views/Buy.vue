<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import BookingForm from '@/components/BookingForm.vue';
import FlightDetails from '@/components/FlightDetails.vue';

const accessToken = ref(localStorage.getItem('accessToken'));
const flightDetails = ref(null);
const bookingConfirmed = ref(false);
const route = useRoute();
const router = useRouter();
const showMessage = ref(false);
const countdown = ref(5);

// Funzione per gestire il countdown e il reindirizzamento
const handleSessionExpired = () => {
  showMessage.value = true;
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(interval);
      router.push('/');
    }
  }, 1000);
};

// Funzione per recuperare i dettagli del volo
const fetchFlightDetail = async () => {
  try {
    if (!accessToken.value) {
      handleSessionExpired();
      return;
    }

    const idFlight = route.params.idFlight;
    if (!idFlight) {
      console.error('ID Flight is undefined or null');
      return;
    }

    const response = await axiosInstance.get(`flight/${idFlight}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
      }
    });

    if (response.status === 200) {
      flightDetails.value = response.data;
    } else {
      console.error('Failed to fetch flight details:', response);
      flightDetails.value = null;
    }
  } catch (error) {
    console.error('Error fetching flight details:', error);
    flightDetails.value = null;
  }
};

// Funzione per continuare la prenotazione nella home
const continueBooking = () => {
  router.push('/home');
};

// Funzione per visualizzare le prenotazioni
const viewBooking = () => {
  router.push('/prenotations');
};

onMounted(fetchFlightDetail);
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

    <div v-if="!bookingConfirmed" class="flex flex-col items-center justify-center tablet:flex-row tablet:h-screen">
      <FlightDetails :flightDetails="flightDetails" />
      <BookingForm :idFlight="flightDetails.idFlight" :ticketPrice="flightDetails.price"
        :places="flightDetails.availablePlace" :bookingConfirmed="bookingConfirmed"
        @update:bookingConfirmed="bookingConfirmed = $event" v-if="flightDetails" />
    </div>

    <!-- Visualizza il riepilogo della prenotazione dopo aver prenotato con successo -->
    <div v-else class="h-112 flex items-center justify-center">
      <div class="bg-white w-96 h-80 flex flex-col items-center justify-center rounded-lg shadow-xl">
        <h2 class="text-2xl font-bold text-middle">Booking Confirmed!</h2>
        <p class="mb-8 text-sm text-darkGray">Your flight has been successfully booked.</p>
        <div class="flex items-center justify-center text-sm">
          <button @click="viewBooking"
            class="shadow-xl mx-2 px-4 py-2 text-darkGray rounded-lg hover:bg-middle hover:text-white focus:outline-none">View
            Bookings</button>
          <button @click="continueBooking"
            class="shadow-xl mx-2 bg-light text-white px-4 py-2 rounded-lg hover:bg-middle focus:outline-none">Continue
            Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

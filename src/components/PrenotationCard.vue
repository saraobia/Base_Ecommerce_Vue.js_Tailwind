<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  orderDetails: Array,
});

const error = ref(false);
const name = localStorage.getItem('name');
const surname = localStorage.getItem('surname');
const router = useRouter();

// Variabile di stato per tenere traccia dell'ID dell'ordine espanso
const expandedOrders = ref(null);
console.log('expandedOrders:', expandedOrders.value);

// Funzione per gestire il clic sul pulsante "Show more"
const toggleExpand = (orderId) => {
  expandedOrders.value = expandedOrders.value === orderId ? null : orderId;
  console.log('expandedOrders:', expandedOrders.value);
};

const addMoreTickets = (order) => {
  router.push('tickets/flight/' + order.flight.idFlight);
};
</script>

<template>
  <div class="p-4">
    <ul v-if="orderDetails && orderDetails.length > 0"
      class="flex flex-col items-center customPrenotation:grid grid-cols-2 gap-6 tablet:grid-cols-3">
      <li v-for="order in orderDetails" :key="order.id"
        class="bg-white shadow-md rounded-lg p-12 customPrenotation:p-8">
        <div class="mb-6 text-darkGray text-sm">
          <h2 class="font-extrabold text-middle text-lg">Code Order: {{ order.idOrder }}</h2>
          <p>Client detail: {{ name }} {{ surname }} </p>
          <p>Flight Name: {{ order.flight.flightName }}</p>
          <div v-if="expandedOrders === order.id">
            <!-- Mostra dettagli solo se l'ordine è espanso -->
            <p>Airport departure: {{ order.flight.airportDeparture }}</p>
            <p>Airport destination: {{ order.flight.airportDestination }}</p>
            <p>Date: {{ order.flight.dateFlight }}</p>
            <p>Hour: {{ order.flight.timeFlight }}</p>
            <p>Available place: {{ order.flight.availablePlace }}</p>
            <p>Ticket quantity: {{ order.ticketQuantity }}</p>
            <p>Total price: {{ order.totalPrice }} $</p>
            <p>Type of payment: {{ order.typePayment }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button @click="toggleExpand(order.id)"
            class="p-2 text-xs rounded-md shadow-xl hover:bg-middle text-darkGray hover:text-white">
            {{ expandedOrders === order.id ? 'Show less' : 'Show more' }}
          </button>
          <button @click="addMoreTickets(order)"
            class="p-2 text-xs rounded-md text-white bg-light shadow-xl hover:bg-middle">Add
            tickets
          </button>
        </div>
      </li>
    </ul>
    <p v-else-if="orderDetails && orderDetails.length === 0" class="text-gray-500">You have no orders.</p>
    <p v-else class="text-gray-500">Loading...</p>
    <p v-if="error" class="text-red-500">Error fetching orders.</p>
  </div>
</template>

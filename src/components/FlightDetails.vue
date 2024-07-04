<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  flightDetails: Object,
});
</script>

<template>
  <div class="w-96 h-112 bg-white p-8 rounded-lg shadow-lg bigSmartphone:w-96 laptop:w-112 ">
    <div v-if="flightDetails">
      <h1 class="text-2xl text-middle text-center font-bold mb-4"><span class="font-medium text-dark"> Flight </span>
        Details</h1>
      <div class="text-sm text-darkGray">
        <h3 class="font-medium text-dark">Flight Code: <span class=" font-bold text-middle"> {{ flightDetails.idFlight
            }} </span>
        </h3>
        <p>Airport Departure: {{ flightDetails.airportDeparture }}</p>
        <p>Airport Destination: {{ flightDetails.airportDestination }}</p>
        <p>Flight Name: {{ flightDetails.flightName }}</p>
        <p>Date: {{ flightDetails.dateFlight }}</p>
        <p>Time: {{ flightDetails.timeFlight }}</p>
        <p>Available Places: {{ flightDetails.availablePlace }}</p>
        <p>Price for ticket: {{ flightDetails.price }} $</p>
      </div>
      <div class="mt-4">
        <h6 class="font-bold text-middle">More information:</h6>
        <p class="text-xs text-lightGray">
          Booking and Check-In Reservations: Passengers are encouraged to book flights well in advance.
          Tickets can be purchased online, through our mobile app, or via our customer service hotline.
          Check-In: Online check-in opens 48 hours before departure and closes 2 hours prior to the flight.
          Airport check-in counters close 60 minutes before departure for domestic flights and 90 minutes for
          international flights.
        </p>
      </div>
    </div>
    <div v-else>
      <p>Loading flight details...</p>
    </div>
  </div>
</template>

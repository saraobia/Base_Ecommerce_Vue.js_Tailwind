<script setup>

</script>

<template>
  <!-- FOOTER -->
  <footer> <!-- FOOTER CONTAINER -->
    <div class=" text-white flex flex-col items-center justify-between py-4 px-4 bg-background ">
      <!-- CONTAINER LOGO AND NAVIGATION -->
      <div class=" p-2 mb-8 flex justify-between w-full">
        <!-- FOOTER NAVIGATION -->
        <ul class="flex justify-center mb-4 text-sm">

          <li class="px-4 py-2">
            <RouterLink name="about" to="/home" class="text-middle font-semibold  hover:underline">
              About Us
            </RouterLink>
          </li>
          <li class="px-4 py-2">
            <RouterLink name="services" to="/home" class="text-middle font-semibold  hover:underline">
              Services
            </RouterLink>
          </li>
          <li class="px-4 py-2">
            <RouterLink name="contact" to="/home" class="text-middle font-semibold  hover:underline">
              Contact
            </RouterLink>
          </li>
        </ul>

        <!-- FOOTER LOGO -->
        <div class="flex items-center mb-4">
          <font-awesome-icon :icon="['fas', 'plane-departure']" class="h-6 w-6 text-middle mr-2" />
          <span class="font-extrabold text-middle uppercase">Airline.co</span>
        </div>
      </div>

      <!-- FOOTER SOCIAL ICONS -->
      <div class="flex justify-center mb-2 text-lightGray">
        <a href="https://facebook.com" target="_blank" class="mx-2  hover:text-darkGray">
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
        <a href="https://twitter.com" target="_blank" class="mx-2  hover:text-darkGray">
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>

        <a href="https://linkedin.com" target="_blank" class="mx-2  hover:text-darkGray">
          <font-awesome-icon :icon="['fab', 'square-twitter']" />
        </a>
      </div>


      <!-- FOOTER COPYRIGHT -->
      <div class="text-sm text-darkGray">
        &copy; 2024 Airline.co. All rights reserved.
      </div>
    </div>
  </footer>
</template>
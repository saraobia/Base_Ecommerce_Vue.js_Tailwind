<script setup>
import { ref, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/composable/cart';

const { cartCount, updateCartCount, removeCart } = useCart();

const router = useRouter();
const isDropdownOpen = ref(false);
const isConfirmLogoutOpen = ref(false);
const name = localStorage.getItem('name');

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};


watchEffect(() => {
  // Questo si attiverà ogni volta che la rotta cambia
  router.currentRoute.value; // Accedi alla rotta corrente per attivare la reattività
  isDropdownOpen.value = false;
});

const confirmLogout = () => {
  const cartCount = localStorage.getItem('cartCount')
  if (cartCount >= 1) {
    isConfirmLogoutOpen.value = true;
  } else {
    exitAndRemoveData();
  }
};

const cancelLogout = () => {
  isConfirmLogoutOpen.value = false;
};

const exitAndRemoveData = async () => {
  const currentIdCart = localStorage.getItem('idCart');
  const currentIdClient = localStorage.getItem('idClient');
  await removeCart(currentIdCart, currentIdClient);

  // REMOVE LOCAL STORAGE DETAIL
  ['accessToken', 'idClient', 'idCart', 'name', 'surname', 'email', 'cartCount'].forEach(item => {
    localStorage.removeItem(item);
  });

  router.push({ name: 'login' });
};




onMounted(() => {
  updateCartCount();
  window.addEventListener('storage', updateCartCount);
});

onUnmounted(() => {
  window.removeEventListener('storage', updateCartCount);
});
// MANAGE LOCAL STORAGE CHANGE
watch(() => localStorage.getItem('cartCount'), updateCartCount);

</script>

<template>
  <header>
    <nav class="fixed w-screen flex py-4 px-4 justify-between items-center bg-background text-white z-50">
      <ul class="flex justify-center items-center mt-1">
        <li class="font-black text-whites">
          <RouterLink name="home" to="/home">
            ETech
          </RouterLink>
        </li>
      </ul>

      <ul class="flex justify-center items-center">
        <RouterLink name="cart" to="/cart">
          <li class="relative">
            <font-awesome-icon :icon="['fas', 'cart-shopping']" />
            <span v-if="cartCount > 0"
              class="absolute -top-3 -right-4 bg-primary text-white rounded-full px-2 py-1 text-xs font-bold">
              {{ cartCount }}
            </span>
          </li>
        </RouterLink>
        <li class="px-2">

          <!-- DROPDOWN ICON -->
          <div class=" w-8">
            <button @click="toggleDropdown" class="dropdown-button flex items-center">
              <font-awesome-icon :icon="isDropdownOpen ? ['fas', 'times'] : ['fas', 'user']"
                class="px-3 z-50 right-5 absolute" />
            </button>
          </div>
          <!-- CONTENTS DROPDOWN -->
          <div v-if="isDropdownOpen" class="fixed inset-0 flex items-center justify-center z-40">
            <ul
              class="bg-card flex flex-col items-center justify-center w-full h-full p-4 text-sm text-tDarkGray font-semibold">

              <li class="font-black text-lg text-primary mb-6 w-full  py-2 flex flex-col items-center justify-center">
                <div
                  class="flex items-center bg-hoverLight justify-center h-16 w-16 rounded-full shadow-inner-strong mx-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#27C499" class="h-8 w-8 ">
                    <path fill-rule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                Welcome {{ name }}
              </li>

              <li class="w-36 px-4  py-2 mb-2 shadow-inner-strong cursor-pointer hover:bg-primary rounded-lg">
                <RouterLink name="orders-history" to="/orders-history">My Orders</RouterLink>
              </li>
              <li class="w-36 px-4  py-2 mb-2 shadow-inner-strong cursor-pointer hover:bg-primary rounded-lg">
                <RouterLink name="home" to="/home">Back to home</RouterLink>
              </li>
              <li class="w-36 px-4  py-2 mb-2 shadow-inner-strong cursor-pointer hover:bg-primary rounded-lg">
                <button @click="confirmLogout">Logout</button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </header>

  <!-- Confirm Logout Popup -->
  <div v-if="isConfirmLogoutOpen"
    class="fixed inset-0 flex items-center justify-center z-50 bg-background bg-opacity-85">
    <div class="bg-card w-112  p-6 rounded-lg shadow-lg">
      <p class="text-white text-sm mb-8"><span class="font-bold text-tDarkGray">If you log out, your cart will be
          deleted. <br></span>
        Do you really want
        to log out?
      </p>
      <div class="flex justify-end font-bold text-sm">
        <button @click="cancelLogout" class="bg-primary text-white px-4 py-2 rounded-full mr-2">Continue</button>
        <button @click="exitAndRemoveData" class="bg-danger text-white px-4 py-2 rounded-full">Logout</button>
      </div>
    </div>
  </div>
</template>

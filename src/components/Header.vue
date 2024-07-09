<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
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
  console.log(currentIdCart, currentIdClient);
  await removeCart(currentIdCart, currentIdClient);

  // REMOVE LOCAL STORAGE DETAIL
  ['accessToken', 'idClient', 'idCart', 'name', 'surname', 'email', 'cartCount'].forEach(item => {
    localStorage.removeItem(item);
  });

  router.push({ name: 'login' });
};

const handleClickOutside = (event) => {
  if (isDropdownOpen.value) {
    const dropdownButton = document.querySelector('.dropdown-button');
    if (dropdownButton && !dropdownButton.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  updateCartCount();
  window.addEventListener('storage', updateCartCount);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
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
          <button @click="toggleDropdown" class="dropdown-button flex items-center">
            <font-awesome-icon :icon="['fas', 'user']" class="px-2" />
          </button>
          <div v-if="isDropdownOpen" class="fixed inset-0 flex items-center justify-center z-50">
            <ul class="bg-card flex flex-col items-center justify-center w-full h-full p-4 text-sm text-darkGray">
              <li class="font-black text-primary mb-2"> {{ name }}</li>
              <li class="p-2 cursor-pointer hover:bg-hoverLight hover:rounded-md">
                <RouterLink name="orders-history" to="/orders-history">My Orders</RouterLink>
              </li>
              <li class="p-2 cursor-pointer hover:bg-hoverLight hover:rounded-md">
                <RouterLink name="home" to="/home">Back to home</RouterLink>
              </li>
              <li class="p-2 cursor-pointer hover:bg-hoverLight hover:rounded-md">
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

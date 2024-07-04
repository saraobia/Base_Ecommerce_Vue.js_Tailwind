<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isDropdownOpen = ref(false);
const name = localStorage.getItem('name');
const cartCount = ref(0);

const updateCartCount = () => {
  cartCount.value = parseInt(localStorage.getItem('cartCount') || '0');
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const exitAndRemoveData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idClient');
  localStorage.removeItem('name');
  localStorage.removeItem('surname');
  localStorage.removeItem('email');
  localStorage.removeItem('cartCount');
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

watch(() => localStorage.getItem('cartCount'), updateCartCount);
</script>

<template>
  <header>
    <nav class="fixed w-screen  flex py-4 px-4 justify-between items-center bg-background text-white">
      <ul class="flex justify-center items-center mt-1">
        <li class="font-black text-primary">
          <RouterLink name="home" to="/home">
            E-Tech
          </RouterLink>
        </li>
      </ul>

      <ul class="flex justify-center items-center">
        <li class="relative">
          <font-awesome-icon :icon="['fas', 'cart-shopping']" />
          <span v-if="cartCount > 0"
            class="absolute -top-3 -right-4 bg-primary text-white rounded-full px-2 py-1 text-xs font-bold">
            {{ cartCount }}
          </span>
        </li>
        <li class="px-2">
          <button @click="toggleDropdown" class="dropdown-button flex items-center">
            <font-awesome-icon :icon="['fas', 'user']" class="px-2" />
          </button>
          <div v-if="isDropdownOpen" class="fixed inset-0 flex items-center justify-center z-50">
            <ul class="bg-card flex flex-col items-center justify-center w-full h-full p-4 text-sm text-darkGray">
              <li class="font-black text-primary mb-2"> Welcome {{ name }}</li>
              <li class="p-2 cursor-pointer hover:bg-hoverLight hover:rounded-md">
                <RouterLink name="prenotations" to="/prenotations">Order</RouterLink>
              </li>
              <li class="p-2 cursor-pointer hover:bg-hoverLight hover:rounded-md">
                <RouterLink name="home" to="/home">Back to home</RouterLink>
              </li>
              <li class="p-2 cursor-pointer hover:bg-hoverLight hover:rounded-md">
                <button @click="exitAndRemoveData">Logout</button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script setup>
import { ref } from 'vue';
import axiosInstance from '@/axiosInstance';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoggedIn = ref(!!localStorage.getItem('accessToken'));
const successMessage = ref('');

const handleSubmit = async () => {
  try {
    const response = await axiosInstance.post('auth/login', {
      email: email.value,
      password: password.value
    });
    const accessToken = response.data;

    if (!accessToken) {
      throw new Error('Access token not present in the response.');
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('email', email.value);
    isLoggedIn.value = true;


    // ROUTE TO HOME PAGE
    router.push({ name: 'home' });

    // CHECK TOKEN EXPIRE AND REMOVE IT
    checkTokenExpiry();
  } catch (error) {
    handleLoginError(error);
  }
};
// TOKEN EXPIRE CONTROLLER
const checkTokenExpiry = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const tokenExpiration = tokenData.exp * 1000;

    if (Date.now() > tokenExpiration) {
      localStorage.removeItem('accessToken');
      isLoggedIn.value = false;
      console.log('Token expired. Please log in again.');
    }
  }
};

//ERROR LOGIN CONTROLLER
const handleLoginError = (error) => {
  if (error.response) {
    console.error('Error during login:', error.message);
    errorMessage.value = 'Error: invalid customer code or password.';
  } else if (error.request) {
    console.error('Request error:', error.request);
    errorMessage.value = 'Error during the request. Check network connection.';
  } else {
    console.error('Generic error:', error.message);
    errorMessage.value = 'Error during login. Please try again later.';
  }
};
</script>

<template>
  <div class="absolute top-0 right-0 bottom-0 left-0 ">
    <div class="flex items-center justify-center h-screen">
      <div class="bg-card p-8 rounded-lg shadow-lg w-80">

        <div class="w-full flex items-center justify-center mb-2 ">
          <div class="flex items-center bg-hoverLight justify-center h-16 w-16 rounded-full shadow-inner-strong">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#27C499" class="h-8 w-8 ">
              <path fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleSubmit">
          <!-- CUSTOMER CODE -->
          <div class="mb-4">
            <input type="text" id="email" v-model="email"
              class="w-full bg-card text-tGray text-xs p-4 rounded-lg shadow-inner-strong active:bg-card focus:bg-card focus:outline-none"
              required placeholder="Email" />
          </div>
          <!-- PASSWORD -->
          <div class="mb-8 ">
            <input type="password" id="password" v-model="password"
              class="w-full bg-card text-tGray text-xs p-4 rounded-lg shadow-inner-strong active:bg-card focus:outline-none"
              required placeholder="Password" />
          </div>
          <!-- SUBMIT -->
          <div class="flex items-center justify-end">

            <button type="submit"
              class="text-sm font-bold w-32 bg-primary text-white py-3 rounded-full drop-shadow-2xl hover:bg-middle focus:outline-none">
              Login
            </button>
          </div>
          <p v-if="errorMessage" class="font-bold text-sm text-danger mt-4">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

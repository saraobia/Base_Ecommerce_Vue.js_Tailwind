import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default function useAuth() {
  const router = useRouter();
  const showMessage = ref(false);
  const countdown = ref(5);

  const checkAccessToken = (accessToken) => {
    if (!accessToken) {
      showMessage.value = true;
      const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(interval);
          router.push('/');
        }
      }, 1000);
      return false;
    }
    return true;
  };

  return {
    showMessage,
    countdown,
    checkAccessToken,
  };
}

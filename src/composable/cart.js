import { ref } from 'vue';
import axiosInstance from '@/axiosInstance';
import useAuth from '@/composable/useAuth';

const { checkAccessToken } = useAuth();
const accessToken = localStorage.getItem('accessToken');

export function useCart() {
  const cartCount = ref(parseInt(localStorage.getItem('cartCount') || '0'));

  const updateCartCount = () => {
    cartCount.value = parseInt(localStorage.getItem('cartCount') || '0');
  };

  const removeCart = async (idCart, idClient) => {
    try {
      if (!checkAccessToken(accessToken)) {
        return;
      }

      if (!idCart || !idClient) {
        console.error('idClient or idCart is null or undefined:', {
          idClient,
          idCart,
        });
        return;
      }

      await axiosInstance.delete(`cart/${idCart}/${idClient}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      localStorage.setItem('cartCount', '0');
      updateCartCount();
    } catch (error) {
      console.error('Error removing cart:', error);
    }
  };

  const addToCart = async (idClient, idArticle, quantity) => {
    try {
      if (!checkAccessToken(accessToken)) {
        return;
      }
      const response = await axiosInstance.post(
        `cart/${idClient}/${idArticle}/${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem('idCart', response.data);
        let newCartCount =
          parseInt(localStorage.getItem('cartCount') || '0') + quantity;
        localStorage.setItem('cartCount', newCartCount.toString());
        updateCartCount();

        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'));
      } else if (response.status === 400) {
        throw new Error('Insufficient quantity available');
      }
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeCartItem = async (idCart, idArticle) => {
    try {
      if (!checkAccessToken(accessToken)) {
        return;
      }
      await axiosInstance.delete(`cart/${idCart}/article/${idArticle}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
      cartCount = Math.max(cartCount - 1, 0); // Ensure it doesn't go below 0
      localStorage.setItem('cartCount', cartCount.toString());
      updateCartCount();

      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const createOrderFromCart = async (idCart) => {
    try {
      if (!checkAccessToken(accessToken)) {
        return;
      }

      const response = await axiosInstance.post(
        `order/cart/${idCart}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      localStorage.setItem('idCart', ''); // Reset idCart in localStorage
      localStorage.setItem('cartCount', '0');
      updateCartCount();

      window.dispatchEvent(new Event('storage'));
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return {
    cartCount,
    updateCartCount,
    removeCart,
    addToCart,
    removeCartItem,
    createOrderFromCart,
  };
}

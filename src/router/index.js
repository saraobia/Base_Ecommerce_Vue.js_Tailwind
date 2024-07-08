import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import OrdersHistory from '../views/OrdersHistory.vue';
import Order from '../views/Order.vue';
import Page404 from '../views/Page404.vue';
import SinglePage from '../views/SinglePage.vue';
import Cart from '../views/Cart.vue';

import NoHeaderFooterLayout from '../layouts/NoHeaderFooterLayout.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: { layout: 'NoHeaderFooterLayout' }, // Layout per la rotta principale
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true, layout: 'DefaultLayout' }, // Layout per questa rotta
  },
  {
    path: '/orders-history',
    name: 'ordersHistory',
    component: OrdersHistory,
    meta: { requiresAuth: true, layout: 'DefaultLayout' }, // Layout per questa rotta
  },
  {
    path: '/order/:id',
    name: 'order',
    component: Order,
    meta: { requiresAuth: true, layout: 'DefaultLayout' }, // Layout per questa rotta
  },
  {
    path: '/article/:id',
    name: 'SinglePage',
    component: SinglePage,
    meta: { requiresAuth: true, layout: 'DefaultLayout' },
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart,
    meta: { requiresAuth: true, layout: 'DefaultLayout' },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'page404',
    component: Page404,
    meta: { layout: 'NoHeaderFooterLayout' }, // Layout per questa rotta
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

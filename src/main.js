import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// FONTAWESOME
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCreditCard,
  faMoneyBillTransfer,
  faBars,
  faXmark,
  faPlaneDeparture,
  faCaretDown,
  faEllipsis,
  faShoppingCart,
  faUser,
  faMinus,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  faPaypal,
  faGooglePay,
  faFacebook,
  faSquareTwitter,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faCreditCard,
  faPaypal,
  faGooglePay,
  faBars,
  faXmark,
  faMoneyBillTransfer,
  faPlaneDeparture,
  faFacebook,
  faSquareTwitter,
  faLinkedin,
  faCaretDown,
  faEllipsis,
  faShoppingCart,
  faUser,
  faMinus,
  faPlus,
  faTimes
);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);

app.mount('#app');

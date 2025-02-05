import { createRouter, createWebHistory } from 'vue-router'

/* Constants */
import navRoutes from '../constants/nav-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: navRoutes
});

export default router;

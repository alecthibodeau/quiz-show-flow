/* Components */
import HomeView from '../views/HomeView.vue';
import ScoreView from '../views/ScoreView.vue';

/* Interfaces */
import type { Route } from '../interfaces/Route';

const isRoutingActive: boolean = false;

const navRoutes: Route[] = [
  {
    path: '/',
    name: 'home',
    component: isRoutingActive ? HomeView : ScoreView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/score',
    name: 'score',
    component: () => import('../views/ScoreView.vue')
  }
];

export default navRoutes;

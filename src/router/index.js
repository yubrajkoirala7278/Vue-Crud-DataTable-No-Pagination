// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // ======frontend=========
  {
    path: '/',
    name:'public',
    component: () => import('@/layouts/frontend/app_layout.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/modules/home/home.vue'),
      },
      {
        path:'/:pathMatch(.*)*',
        name:'errorPage',
        component: () => import('@/modules/error-page/error.vue'),
      }
    ],
  },
  // ========admin===========
  {
    path: '/admin',
    name:'private',
    component: () => import('@/layouts/auth/app_layout.vue'),
    children: [
      {
        path: '/admin/products',
        name: '   ',
        component: () => import('@/modules/admin_products/products.vue'),
      },
      {
        path: "/admin/:id/product-details",
        name: "product-details",
        component: () =>import("@/modules/admin_products/components/product-detail.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

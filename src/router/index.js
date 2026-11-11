import { createRouter, createWebHistory } from 'vue-router'
import CountryListView from '../views/CountryListView.vue'
import CountryDetailView from '../views/CountryDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'countries-list',
    component: CountryListView
  },
  {
    path: '/pays/:code',
    name: 'country-detail',
    component: CountryDetailView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

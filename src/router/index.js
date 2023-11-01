import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ViewOne from "../views/ViewOne.vue";
import ViewTwo from "../views/ViewTwo.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      // props: (route) => ({
      //   searchData: route.query,
      // }),
    },
    { path: "/view-one", name: "view-one", component: ViewOne },
    { path: "/view-two", name: "view-two", component: ViewTwo },
  ],
});

export default router;

import Vue from "vue";
import Router from "vue-router";

const routerOptions = [
  { path: "/", component: "pages/home" },
  { path: "/android", component: "pages/android/android" },
  { path: "/ios", component: "pages/ios" },
  { path: "/mac", component: "pages/mac" },
  { path: "/history", component: "pages/history" },
  { path: "*", component: "pages/not-found" }
];
const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/${route.component}.vue`)
  };
});

Vue.use(Router);

export default new Router({
  routes,
  mode: "history"
});

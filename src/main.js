// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "../static/fontawesome/fontawesome/font-awesome.min.css";
// import { fontawesome } from "@fortawesome/fontawesome-free";
import {
  FontAwesomeIcon,
  FontAwesomeLayers
} from "@fortawesome/vue-fontawesome";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import VueSocketio from "vue-socket.io";
import socketio from "socket.io-client";
import VueLogger from "vuejs-logger";
// import vueLogger from "vue-logger";
import App from "./App";
import router from "./router";
import store from "./store/";

Vue.config.productionTip = false;

const options = {
  // optional : defaults to true if not specified
  isEnabled: true,
  // required ['debug', 'info', 'warn', 'error', 'fatal']
  logLevel: "debug",
  // optional : defaults to false if not specified
  stringifyArguments: false,
  // optional : defaults to false if not specified
  showLogLevel: false,
  // optional : defaults to false if not specified
  showMethodName: true,
  // optional : defaults to '|' if not specified
  separator: "▷",
  // optional : defaults to false if not specified
  showConsoleColors: true
};

Vue.use(VueLogger, options);

library.add(fas, far, fab);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);

Vue.use(ElementUI);
Vue.use(
  new VueSocketio({
    connection: socketio("http://127.0.0.1:5500/general"),
    vuex: {
      store,
      // actionPrefix: 'SOCKET_',
      // mutationPrefix: 'SOCKET_',
      options: {
        useConnectionNamespace: true
      }
    }
  })
);

Vue.mixin({
  mounted() {
    // add short name for logger
    Vue.prototype[`$debug`] = this.$log.debug;
    Vue.prototype[`$info`] = this.$log.info;
    Vue.prototype[`$warn`] = this.$log.warn;
    Vue.prototype[`$error`] = this.$log.error;
    Vue.prototype[`$fatal`] = this.$log.fatal;

    // init server connect state
    if (this.$store !== undefined && this.$store !== null) {
      if (this.$socket.connected) {
        this.$store.commit("SERVER_CONNECT");
      } else {
        this.$store.commit("SERVER_DISCONNECT");
      }
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
  // methods: {
  //   debug() {}
  // }
});

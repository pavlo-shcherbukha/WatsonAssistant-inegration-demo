import Vue from "vue";
import App from "./App.vue";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    dark: false
  },
  icons: {
    iconfont: "mdiSvg" || "md" || "mdi" // "mdi" || "mdiSvg" || "md" || "fa" || "fa4"
    //iconfont: "md",
  }
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");

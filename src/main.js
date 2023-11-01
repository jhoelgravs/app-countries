import "./assets/main.css";

import { createApp, provide, h } from "vue";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import App from "./App.vue";
import router from "./router";

library.add(faUserSecret);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://countries.trevorblades.com/",
});

createApp({
  setup() {
    provide(DefaultApolloClient, client);
  },
  render: () => h(App),
})
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");

<script setup>
import Sidebar from "./components/Sidebar.vue";
import SearchBar from "./components/SearchBar.vue";
</script>

<script>
export default {
  data() {
    return {
      searchData: {
        searchValue: "",
        selectedContinents: [],
      },
    };
  },
  methods: {
    handleSearch(data) {
      this.searchData = data;
    },
  },
  components: { SearchBar },
};
</script>

<template>
  <Sidebar />

  <main>
    <SearchBar @search="handleSearch" />

    <router-view class="container" :searchData="searchData"></router-view>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  margin-left: 18rem;
  margin-right: 0.5rem;
}

.container {
  margin-top: 6rem;
  height: 100%;
}
</style>

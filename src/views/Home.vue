<script>
import { ref, onMounted } from "vue";
import { useQuery } from "@vue/apollo-composable";
import axios from "axios";
import gql from "graphql-tag";

export default {
  props: { searchData: Object },
  data() {
    return {
      countryImages: {},
      detailsCountry: {},
      showDetails: false,
      imageLoad: false,
    };
  },
  setup(props) {
    const { result, loading, error } = useQuery(gql`
      query Countries {
        countries {
          name
          capital
          languages {
            name
          }
          continent {
            name
          }
        }
      }
    `);

    const data = ref([]);

    const countryImage = async () => {
      if (result.value) {
        data.value = await Promise.all(
          result.value.countries.map(async (country) => {
            const response = await axios.get("https://pixabay.com/api/", {
              params: {
                key: "40379421-326aaae2b4e90564768ae96b5",
                q: country.name,
              },
            });

            return { ...country, image: response.data.hits[0]?.webformatURL };
          })
        );
      }
    };

    onMounted(() => {
      countryImage();
    });

    return { result, loading, error, data };
  },

  computed: {
    filteredCountries() {
      const { searchCountry, selectedContinents } = this.searchData;

      return this.result.countries.filter((country) => {
        const matchName =
          !searchCountry || country.name.includes(searchCountry);
        const matchContinent =
          selectedContinents.length === 0 ||
          selectedContinents.includes(country.continent.name);

        return matchName && matchContinent;
      });
    },
  },
  methods: {
    loadCountryImage(name) {
      for (const country of this.data) {
        if (country.name === name) {
          return country.image;
        }
      }

      return "";
    },
    toggleDetails(country) {
      this.detailsCountry = country;
      this.showDetails = true;
    },
    hiddenDetails() {
      this.showDetails = false;
    },
  },
};
</script>

<template>
  <div class="home">
    <div class="loader" v-if="loading"></div>
    <div
      class="card"
      v-if="!loading && result"
      v-for="(country, index) in filteredCountries"
      :key="index"
      @click="toggleDetails(country)"
    >
      <div class="image">
        <div class="loader-image" v-if="!loadCountryImage(country.name)"></div>
        <img class="image-content" :src="loadCountryImage(country.name)" />
      </div>

      <div class="content">
        <div class="content__text">
          <span class="country__name">{{ country.name }}</span>
          <span class="continent__name">{{ country.continent.name }}</span>
        </div>
      </div>
    </div>

    <!-- Detalles -->
    <div class="details" v-show="showDetails">
      <div class="close" @click="hiddenDetails">
        <div class="line one"></div>
        <div class="line two"></div>
      </div>
      <img
        class="details__image"
        :src="loadCountryImage(detailsCountry.name)"
      />

      <div class="details__content">
        <div>
          <span class="details-country">{{ detailsCountry.name }}</span>
          <span class="details-continent">
            {{ detailsCountry.continent?.name }}
          </span>
        </div>

        <p><span>Capital: </span>{{ detailsCountry.capital }}</p>
        <p><span>Lenguage: </span>{{ detailsCountry.languages?.[0].name }}</p>
      </div>
    </div>
    <p v-if="error">Something went wrong...</p>
  </div>
</template>

<style>
.home {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  position: relative;

  /* margin-top: 5rem; */
  /* background-color: #9f7cd3; */
}

.card {
  background-color: #1b1a1a;
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 200px;
  gap: 5px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
}

.image {
  display: flex;
  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: center;
  position: relative;
}

.image img {
  width: 100%;
  height: 100%;
  /* visibility: hidden; */
}

.image div {
  position: absolute;
}

.content {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 0 10px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  background-image: linear-gradient(
    to right top,
    #371f05,
    #654607,
    #8b7600,
    #a4ae00,
    #a8eb12
  );
}

.content__text {
  display: flex;
  flex-direction: column;

  color: rgb(216, 213, 213);
}

.country__name {
  font-weight: 900;
  width: 200px;
}

.continent__name {
  font-size: 0.8em;
  font-weight: 500;
}

.country__name:hover {
  color: #9f7cd3;
}

/* Detalles */

.details {
  position: relative;
}

.details .close {
  position: absolute;
  top: 0;
  left: 0;
}

.details {
  position: absolute;
  top: 6rem;
  right: 0;
  width: 20rem;
  position: fixed;
  height: 100%;
  overflow-y: auto;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 10px;
  gap: 20px;

  background-color: var(--color-background);
  box-shadow: 0 0 0 0.2px aquamarine;
  color: var(--color-text);
}

.details img {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

.details__content {
  /* background-color: #0097e6; */
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  padding: 0 10px;
  /* color: white; */
}

.details__content div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.details-country {
  font-size: 24px;
  font-weight: 600;
}

.details-continent {
  font-size: 12px;
}

.details__content p span {
  font-size: 15px;
  font-weight: 500;
}

/* Loader */
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  box-sizing: border-box;
  border-top: 8px solid #fff;
  border-left: 8px solid #fff;
  border-right: 8px solid #ff00;
  animation: loader 0.7s infinite linear;
}

@keyframes loader {
  to {
    transform: rotate(360deg);
  }
}

/* Loader Image */
.loader-image {
  width: 64px;
  height: 64px;
  position: relative;
  background: #f4f4f4;
  border-radius: 4px;
  overflow: hidden;
}

.loader-image:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  transform: rotate(45deg) translate(30%, 40%);
  background: #2e86de;
  box-shadow: 32px -34px 0 5px #0097e6;
  animation: slide 2s infinite ease-in-out alternate;
}

.loader-image:after {
  content: "";
  position: absolute;
  left: 10px;
  top: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0097e6;
  transform: rotate(0deg);
  transform-origin: 35px 145px;
  animation: rotate 2s infinite ease-in-out;
}

@keyframes slide {
  0%,
  100% {
    bottom: -35px;
  }

  25%,
  75% {
    bottom: -2px;
  }

  20%,
  80% {
    bottom: 2px;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(-15deg);
  }

  25%,
  75% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(25deg);
  }
}

/* CLose icon */
.close {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.line {
  position: absolute;
  width: 20px;
  height: 3px;
  background-color: #6b6c7b;
  border-radius: 30px;
}

.line.one {
  transform: rotate(45deg);
}

.line.two {
  transform: rotate(135deg);
}
</style>

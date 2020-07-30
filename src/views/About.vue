<template>
  <v-main id="about">
    <ul>
      <li>
        Developers:
        <a href="https://enkeldigital.com" target="_blank">Enkel Digital</a>
      </li>
      <li>App Status: Pre-alpha, technical preview</li>
      <li>App version: 0.0.1</li>
      <li>API version: 0.0.1</li>
    </ul>

    <br />

    <h3>Configs</h3>
    <ul>
      <li v-for="configKey in Object.keys(configs)" :key="configKey">
        {{ configKey }}: {{ configs[configKey] }}
      </li>
    </ul>

    <br />

    <h3>Constants</h3>
    <ul>
      <li v-for="constantKey in Object.keys(constants)" :key="constantKey">
        {{ constantKey }}: {{ constants[constantKey] }}
      </li>
    </ul>
  </v-main>
</template>

<script>
import configs from "@/config";
// import constants from "@/constants";

export default {
  name: "about",
  data() {
    return {
      configs,
      constants: {}, // Empty for now as constants dir/ is not exporting anything yet
    };
  },
};
</script>

<style scoped>
#about {
  text-align: left;
}
</style>

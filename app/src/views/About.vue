<template>
  <v-main id="about">
    <h3>Build info</h3>
    <ul>
      <li>Build Time: {{ buildTime }}</li>
      <li>Commit Hash: {{ commitHash }}</li>
      <li>Branch: {{ gitBranch }}</li>
      <li>NODE_ENV: {{ NODE_ENV }}</li>
    </ul>

    <br />

    <h3>Vue Env injected with "VUE_APP_"</h3>
    "VUE_APP_" is stripped out
    <ul>
      <li v-for="envKey in Object.keys(env)" :key="envKey">
        {{ envKey.replace("VUE_APP_", "") }}: {{ env[envKey] }}
      </li>
    </ul>

    <br />

    <h3>App info</h3>
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

      env: process.env,

      buildTime: process.env.buildTime,
      commitHash: process.env.commitHash,
      gitBranch: process.env.gitBranch,
      NODE_ENV: process.env.NODE_ENV,
    };
  },
};
</script>

<style scoped>
#about {
  text-align: left;
}
</style>

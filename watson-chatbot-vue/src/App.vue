<template>
  <div id="app">
    <bot-container></bot-container>
  </div>
</template>

<script>
import botContainer from "@/components/BotContainer.vue"

export default {
  name: "App",
  components: {
    "bot-container": botContainer
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

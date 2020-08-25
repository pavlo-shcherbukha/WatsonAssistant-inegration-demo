<template lang="html">
  <div style="display: flex; flex-direction: column">
    <div
      class="container"
      :style="{
        alignSelf: owner === 1 ? 'flex-start' : 'flex-end',
        justifyContent: owner === 1 ? 'flex-start' : 'flex-end'
      }"
    >
      <div class="avatar" v-if="owner === 1">
        <figure class="image">
          <img src="../assets/watson_24.png" alt="Img" />
        </figure>
      </div>

      <div
        v-if="message.response_type === 'text'"
        :class="getClass()"
        :style="{ alignSelf: 'flex-end' }"
      >
        <span class="msg-text" v-html="message.text"></span>
        <span
          class="m-time"
          :style="{
            alignSelf: owner === 1 ? 'flex-end' : 'flex-start'
          }"
          >{{ messageTime }}</span
        >
      </div>

      <div
        v-if="message.response_type === 'option'"
        class="msg opt opt-content"
      >
        <div class="opt-header">
          <span v-html="message.title"></span>
        </div>
        <a
          href="#"
          v-for="(item, index) in message.options"
          :key="index"
          class="btn"
          @click="handleBtnClick(item.value.input.text)"
        >
          {{ item.value.input.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: Object,
    owner: Number,
    messageTime: String
  },

  methods: {
    handleBtnClick(payload) {
      console.log(payload);
      this.$emit("selectedOption", payload);
    },

    getClass() {
      if (this.owner === 1) {
        return "msg msg-watson";
      }
      if (this.owner === 0) {
        return "msg msg-user";
      }
    },

    catch() {
      console.log("Catch");
    }
  },

  mounted() {
    console.log("ITEM: ", this.message.response_type);
  }
};
</script>

<style lang="css" scoped>
@font-face {
  font-family: Roboto;
  src: url(~@/assets/fonts/roboto/Roboto-Light.ttf) format("truetype");
}

@font-face {
  font-family: RobotoM;
  src: url(~@/assets/fonts/roboto/Roboto-Medium.ttf) format("truetype");
}

@keyframes moveInLeft {
  0% {
    opacity: 0;
    /*transform: translateX(-20px);*/
  }

  80% {
  }

  100% {
    opacity: 1;
    /*transform: translateX(0);*/
  }
}

.container {
  /*border: 1px solid red;*/
  display: flex;
  max-width: 80%;
  margin: 4px 8px;
  padding: 0;
}

.msg {
  border-radius: 12px 12px 12px 12px;
  margin: 4px;
  display: inline-block;
  font-size: 12px;
  max-width: 100%;
  min-width: 20%;
  overflow: hidden;
  border: 1px solid #90a4ae;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.msg-watson {
  border-radius: 12px 12px 12px 0;
  animation-delay: 2s;
  animation: moveInLeft 1s;
  background-color: #eceff1;
  display: flex;
  flex-direction: column;
}

.msg-user {
  border-radius: 12px 12px 0 12px;
  animation-delay: 2s;
  animation: moveInLeft 1s;
  background-color: #efebe9;
}

.msg-text {
  font-family: RobotoM, sans-serif;
  font-size: 12px;
  display: inline-block;
  padding: 2px 12px;
  color: #01579b;
}

.m-time {
  font-family: RobotoM, sans-serif;
  font-size: 10px;
  color: #757575;
  display: inline-block;
  margin: 4px 12px;
}

.opt-label {
  font-style: italic;
  display: inline-block;
  padding: 2px 12px;
}

.opt {
  font-family: Roboto, sans-serif;
  font-size: 12px;
  animation-delay: 4s;
  animation: moveInLeft 1s;
}

.opt-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
  border: 1px solid #90a4ae;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background-color: #eceff1;
  animation-delay: 6s;
  animation: moveInLeft 1s;
  overflow: hidden;
}

.opt-header {
  font-family: RobotoM, sans-serif;
  font-size: 12px;
  padding: 2px 12px;
  display: block;
  background-color: #78909c;
  color: #fff;
  width: 100%;
  margin: 0px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.btn:link,
.btn:visited {
  text-decoration: none;
  transition: all 0.2s;
}

.btn {
  color: #333;
  border: 1px solid #bdbdbd;
  display: inline-block;
  border-radius: 50px;
  padding: 2px 12px;
  margin: 2px 4px;
  background-color: #f5f5f5;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>

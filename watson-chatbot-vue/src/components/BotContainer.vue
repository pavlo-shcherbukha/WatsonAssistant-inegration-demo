<template lang="html">
  <div class="container">
    <div class="chat-window" v-if="show">
      <div class="header">
        <h5>Watson chatbot</h5>
        <v-btn icon x-small>
          <v-icon color="#fff" @click="closeConversation">
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <div ref="dialog" class="conversation">
        <message-item
          ref="msg"
          v-for="(item, index) in dialog"
          :key="index"
          :message="item.message"
          :owner="item.owner"
          :messageTime="item.messageTime"
          @selectedOption="handleOptionSelect"
        ></message-item>

        <!--
        <div class="message" v-for="(item, index) in dialog" :key="index">
          <p>{{ item.message }}</p>
        </div>
        -->
      </div>

      <div class="header">
        <textarea class="input-text" v-model="message"></textarea>
        <v-btn icon x-small>
          <!--
          <v-icon color="#fff" @click="sendMessage">
            mdi-send
          </v-icon>
        -->
          <figure class="image" @click="sendMessage">
            <img src="../assets/send_24w.png" alt="Img" />
          </figure>
        </v-btn>
      </div>
    </div>

    <v-btn
      v-if="!show"
      class="btn"
      absolute
      fab
      bottom
      right
      color="#2E7D32"
      @click="startConversation"
    >
      <!--
      <v-icon color="#fff">mdi-wechat</v-icon
      -->
      <figure class="image">
        <img src="../assets/chat_24w.png" alt="Img" />
      </figure>
    </v-btn>
  </div>
</template>

<script>
//import messageTag from "@/components/message.vue";
import messageTag from "@/components/messageObject.vue";
//import axios from "axios";
import requests from "@/axios/requests.js";

export default {
  components: {
    "message-item": messageTag
  },

  data() {
    return {
      show: false,
      message: null,
      message_time: null,
      dialog: [],

      xmsg: {
        assistant_id: null,
        session_id: null,
        text: null,
        context: "?"
      },

      urlssn: process.env.VUE_APP_NODE_API_URL + "/session",
      url: process.env.VUE_APP_NODE_API_URL + "/sendmsg",
      urldel: process.env.VUE_APP_NODE_API_URL + "/delsession",

      assistant_id: process.env.VUE_APP_NODE_ASSISTANT_ID,
      ssn: "",
      env_var: process.env.VUE_APP_NODE_API_URL
    };
  },

  methods: {
    async startConversation() {
      this.toggleShow();
      await this.createSession();
      await this.sendToBot();
      this.scrollToBottom();
    },

    async closeConversation() {
      await this.deleteSession();

      this.dialog.splice(0, this.dialog.length);
      (this.ssn = null), this.toggleShow();
    },

    toggleShow() {
      this.show = !this.show;
    },

    scrollToBottom() {
      if (this.$refs.dialog) {
        this.$refs.dialog.scrollTop = this.$refs.dialog.scrollHeight;
      }
    },

    getMessageTime() {
      let dt = new Date();

      let minutes = dt.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;

      let hours = dt.getHours();
      hours = hours < 10 ? "0" + hours : hours;

      let seconds = dt.getSeconds();
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let messageTime = `${hours}:${minutes}:${seconds}`;

      return messageTime;
    },

    setSessionParams(response) {
      this.ssn = response.result.session_id;
      console.log("!!!this.ssn === ", this.ssn);

      this.xmsg = {
        assistant_id: this.assistant_id,
        session_id: this.ssn,
        text: "",
        context: "?"
      };

      this.message = null;
    },

    async createSession() {
      console.log("create !");
      console.log("assistant_id: ", process.env);

      if (!this.ssn) {
        await requests.get(this.urlssn, null, this.setSessionParams);
      }
    },

    async sendToBot() {
      if (this.ssn === "") {
        this.addMessageToDialog(
          "Уууупс! Не создана сессия! Обновите страничку!",
          1
        );
        return;
      }

      this.xmsg.text = this.message;
      this.message = "";

      try {
        let ask_question = await requests.post(this.url, this.xmsg);

        console.log(
          "Response: ",
          JSON.stringify(ask_question.data.result, null, 2)
        );

        ask_question.data.result.output.generic.forEach(item => {
          this.dialog.push({
            message: item,
            owner: 1,
            messageTime: this.getMessageTime()
          });
          this.scrollToBottom();
        });
        console.log("Dialog: ", JSON.stringify(this.dialog, null, 2));
      } catch (error) {
        console.log("I catch error", error);
      }
    },

    async deleteSession() {
      var xssn = {
        assistant_id: this.assistant_id,
        session_id: this.ssn
      };

      try {
        let close_dialog = await requests.post(this.urldel, xssn);

        console.log("Response: ", JSON.stringify(close_dialog.data, null, 2));
      } catch (error) {
        console.log("I catch error", error);
      }
    },

    addMessageToDialog(msg, owner) {
      this.dialog.push({
        message: {
          response_type: "text",
          text: msg
        },
        owner: owner,
        messageTime: this.getMessageTime()
      });
    },

    async sendMessage() {
      console.log("ASk to send");
      this.addMessageToDialog(this.message, 0);
      this.scrollToBottom();
      console.log("Moved one");
      await this.sendToBot();
      this.scrollToBottom();
      console.log("moved two");
    },

    async handleOptionSelect(message) {
      this.message = message;
      await this.sendMessage();
      /*
      this.addMessageToDialog(message, 0);
      this.scrollToBottom();
      await this.sendToBot();
      this.scrollToBottom();
      */
    }
  },

  updated() {
    this.scrollToBottom();
  },

  beforeDestroy() {
    // Perform the teardown procedure for someLeakyProperty.
    // (In this case, effectively nothing)
    this.deleteSession();
  }
};
</script>

<style lang="css" scoped>
.container {
  position: relative;
  display: inline-flex;
  width: 250px;
  height: 400px;
  margin: 5px 50px;
  padding: 0;
}
.chat-window {
  height: 100%;
  width: 100%;
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
}
.header {
  border: 1px solid green;
  margin: 0px;
  background-color: #2e7d32;
  color: white;
  padding: 6px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.conversation {
  border: 1px solid gray;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.input-text {
  padding: 4px;
  margin: 0;
  border-radius: 6px;
  width: 90%;
  height: 48px;
  background-color: #fff;
  font-size: 12px;
  color: #000;
}
</style>

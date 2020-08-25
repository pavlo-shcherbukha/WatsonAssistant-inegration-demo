<template lang="html">
  <div
    class="msg"
    :style="{ alignSelf: owner === 1 ? 'flex-start' : 'flex-end' }"
  >
    <p
      class="msg-text"
    >{{ messageText }}</p>
  </div>
</template>

<script>
export default {
  props: {
    messageText: String,
    owner: Number
  }
}
</script>

<style lang="css" scoped>
.msg {
  border: 1px solid blue;
  border-radius: 4px;
  margin: 4px;
  display: inline-block;
  background-color: #E1F5FE;
  font-size: 12px;
  padding: 4px;
  max-width: 70%;
  min-width: 20%;
}

.msg-text {
  display: inline;
}
</style>

<template>
  <div>
    <avue-video ref="video"
                :width="300"></avue-video>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      }

    }
  },
  created () {
    setTimeout(() => {
      this.handleLogin()
    }, 4000)
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  methods: {
    handleLogin () {
      this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
        this.$router.push({ path: this.tagWel.value });
      });
    }
  }
}
</script>

<style>
</style>
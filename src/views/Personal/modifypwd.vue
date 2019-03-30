<template>
<div>

</div>
</template>

<script>
import api from "@/server/app.js";
export default {
  components: {
  },
  data() {
    return {
      resList: [],
      closeAdd: false,
      req: {
        contactMobile: "",
        areaCode: "",
        code: "",
        address: "",
        contactName: "",
        name: "",
        status: "",
        userId:""
      }
    };
  },
  mounted() {
    this.getFirmInfoList();
  },
  methods: {
  

  }
};
</script>
<style scoped>

</style>


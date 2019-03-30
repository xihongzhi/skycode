<template>
<div></div>
</template>

<script>
import addFirm from "@/views/box/addFirm";
import api from "@/server/app.js";
export default {
  components: {
    addFirm
  },
  data() {
    return {
      resList: [],
      resetData: {},
      closeAdd: false,
      req: {
        type: "",
        auditId: "",
        auditName: "",
        auditTime: "",
        createTime: "",
        name: "",
        pageQuery: {
          index: 0,
          size: 10
        },
        phone: "",
        remark: "",
        status: ""
      }
    };
  },
  mounted() {
    this.getPhones();
  },
  methods: {
  }
};
</script>
<style scoped>
</style>


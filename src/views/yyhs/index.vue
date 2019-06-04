<template>
    <div>
        <!-- <iframe name = "child" id = "child" v-bind:src="resultUrl" width="100%" height="880" frameborder="0" scrolling="no" style="position:related;top: 2.8px;left: 0px;"></iframe> -->
          <iframe name = "child" id = "child" v-bind:src="resultUrl" width="100%" height="880" frameborder="0" scrolling="no" style="position:related;top: -100px;left: 0px;"></iframe>

    </div>
</template>
<script>
export default {
  data(){
     return {
       resultUrl:"http://62.234.178.225:8080//yyhs.aspx"
     }
  }
}
</script>


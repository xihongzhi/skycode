<template>
    <div>
        <iframe name = "child" id = "child" v-bind:src="resultUrl" width="1920" height="880" frameborder="0" scrolling="no" style="position:related;top: 2.8px;left: 0px;"></iframe>
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


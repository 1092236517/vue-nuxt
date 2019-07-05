<template>
    <div class="container">
      <commenthead></commenthead>
      <nuxt/>
      <commentfoot></commentfoot>
    </div>
</template>

<script>
import commenthead from "../components/commenthead"
import commentfoot from "../components/commentfoot"
export default {
    name:"",
    components:{commenthead,commentfoot},
    head(){
        return{
            title:"筑牛资讯",
            meta:[
                {hid: 'description', name: 'description', content: 'My custom description'}
            ]
        }
    },
}
</script>



<style lang="less" scoped>
.container{
  min-width: 1200px;
}
</style>

<template>
  <div class="app-container">
    <div class="filter-container" style=" margin-top: 0px;">
      <el-row>
        <label  class="postInfo-container-item">始发机场:</label>
        <el-input v-model="condition.dep" style="width: 120px;" class="filter-item"/>
        <el-button class="filter-item" type="primary"  icon="el-icon-sort" style="-webkit-transform: rotate(90deg); transform: rotate(90 deg); padding:5px; height:40px;width:35px" @click="getTrade"></el-button>
        <label class="postInfo-container-item">到达机场:</label>
        <el-input v-model="condition.arr" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">日期:</label>
        <el-date-picker
          type="daterange"
          v-model="time"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
           @change="dataSearch"
          style="width: 230px;"
          :picker-options="pickerOptions1"
        ></el-date-picker>
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="getList">查询</el-button>
        <!-- <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="outElsx"
        >导出</el-button> -->
      </el-row>
    </div>
    <el-table :data="data"  v-loading="listLoading"
      border
      fit
      highlight-current-row
      empty-text
      :row-style="rowClass"
      :cell-style="cellClass"
      height="420px"
      style="width: 100%"> 

     <template  v-for="(items,index) in dataheader">
        <el-table-column v-if="items.label=='起飞时间'" sortable :key="index" :prop="items.prop" :label="items.label" align="center"></el-table-column>
        <el-table-column v-else :key="index" :prop="items.prop" :label="items.label" align="center" >
          <template v-if="items.children">
            <el-table-column v-for="(item, index) in items.children"
              sortable
              :key="index"
              :prop="item.prop"
              :label="item.label"
              align="center">
              </el-table-column>
          </template>
        </el-table-column>
     </template>
      <div slot="empty">
          <p>
            <label/>
          </p>
        </div>
    </el-table>
     
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { RepFlightLowestPrice } from "@/api/ajax.js";
import { formatDate} from '@/utils/datefarmate'
import { parseTime,deepClone } from "@/utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      downloadLoading: false,
      time: [new Date(), new Date()],
      condition: {
        dep: "",
        arr: "",
      },
       pickerOptions1: {
         disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        } ,
      dataheader: [
        {
          prop: 'aim',
          label: '城市对',
          children:null
        },
        {
              prop: 'flightNo',
              label: '航班号',
              children:null
        },
        {
              prop: 'deptime',
              label: '起飞时间',
              children:null
        },
        {
                label: '旅行日期',
                prop: null,
                children: [
                  {
                    prop: 'price',
                    label: '',
                  }
          ]
        }
        
      ],
      // data: [
      //   {
      //     aim: '2016-05-03',
      //     flightNo: '王小虎',
      //     deptime: '21:50',
      //     province: '100',
      //     city: '300',
      //     address: '660',
      //     zip: 200333
      //   },
      //   {
      //     aim: '2016-05-02',
      //     flightNo: '王小虎',
      //     deptime: '1:50',
      //     province: '200',
      //     city: '400',
      //     address: '552',
      //     zip: 200333
      //   }
      // ]
      data:[]
    };
  },
  mounted() {
   // this.getList();
  },
  methods: {
    rowClass: function (row, index) {
      return { "height": "37px" }
    },
     cellClass: function (cell, index) {
      return { "padding": "0" }
    },
    
    getTrade(){
      let temp=this.condition.dep;
      this.condition.dep=this.condition.arr;
      this.condition.arr=temp;
    },
    dataSearch(){
      debugger;
      var oneTime = new Date().setTime(new Date(this.time[0]).getTime());
      var twoTime = new Date().setTime(new Date(this.time[1]).getTime());
      if( oneTime + 3600 * 1000 * 24 * 7 < twoTime){
           this.$message({message: "时间间隔不能大于7天",type: "warning"});
      }
    },
    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");

      if (this.condition.dep) {
        if (!reg1.test(this.condition.dep.toUpperCase())) {
           this.$message({message: "始发机场必须为三字符",type: "warning"});

          return false;
        }
        this.condition.dep.toUpperCase();
      }else{
         this.$message({message: "始发机场必须为三字符",type: "warning"});
           return false;
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
           this.$message({message: "目的机场必须为三字符",type: "warning"});
          return false;
        }
        this.condition.arr.toUpperCase();
      }else{
         this.$message({message: "目的机场必须为三字符",type: "warning"});
           return false;
      }
       if(this.time){
        var oneTime = new Date().setTime(new Date(this.time[0]).getTime());
        var twoTime = new Date().setTime(new Date(this.time[1]).getTime());
        if( oneTime + 3600 * 1000 * 24 * 7 < twoTime){
            this.$message({message: "时间间隔不能大于7天",type: "warning"});
            return false;
        }
      }
      return true;
    },
    getList() {
      if (!this.validate()) {
        return;
      }
      this.listLoading = true;
      let t = this, o = t.condition;
      if (t.time && t.time.length) {
        o["flightDate"] = formatDate(t["time"][0], "yyyy-MM-dd");
        o["flightDateEnd"] = formatDate(t["time"][1], "yyyy-MM-dd");
      }
      RepFlightLowestPrice(o)
        .then(response => {
          debugger;
          if (response.data.code == "0") {
            this.dataheader=response.data.dataheader;
            this.data = response.data.datadata;
            
          } else {
            this.data = [];
            this.$message({ message: "获取列表失败", type: "error" });
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
          this.$message({ message: "获取列表失败", type: "error" });
        });
    },
    // outElsx() {
    //   if (!this.validate()) {
    //     return;
    //   }
    //   this.downloadLoading = true;
    //   let params={};
    //   let t = this, o = t.condition;
    //   if (t.time && t.time.length) {
    //     params["flightDate"] = formatDate(t["time"][0], "yyyy-MM-dd");
    //     params["flightDateEnd"] = formatDate(t["time"][1], "yyyy-MM-dd");
    //   }
    //   params.dep=o.dep;
    //   params.arr=o.arr;
    //   RepFlightLowestPrice(params)
    //     .then(response => {
    //       if (response.data.code == "0") {
    //         let datas = response.data.data;
    //         this.exportData(datas);
    //       } else {
    //         this.$message({ message: "获取列表失败", type: "error" });
    //       }
    //       this.downloadLoading = false;
    //     })
    //     .catch(err => {
    //       this.downloadLoading = false;
    //       console.log(err);
    //       this.$message({ message: "获取列表失败", type: "error" });
    //     });
    // },
    // exportData(datas) {
    //   let table = [];
    //   datas.forEach(element => {
    //     element.aim = element.ori + "-" + element.arrival;
    //     if (element.tongjiDate) {
    //       element.tongjiDate = this.dateFormat(element.tongjiDate);
    //     }
    //     if (element.oritime) {
    //       element.oritime = this.timeFormat(element.oritime);
    //     }
    //     table.push(element);
    //   });
    //   import("@/vendor/Export2Excel").then(excel => {
    //     const tHeader = [
    //       "日期",
    //       "航段",
    //       "起飞时间",
    //       "航班号",
    //       "布局",
    //       "客座率",
    //       "采集时间"
    //     ];
    //     const filterVal = [
    //       "tongjiDate",
    //       "aim",
    //       "oritime",
    //       "flightNo",
    //       "layout",
    //       "kezuoRate",
    //       "addtime"
    //     ];
    //     const list = table;
    //     const data = this.formatJson(filterVal, list);
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+"航班客座率查询"
    //     });
    //     this.downloadLoading = false;
    //   });
    // },
    // formatJson(filterVal, jsonData) {
    //   debugger;
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //         return v[j];
    //     })
    //   );
    // }
  }
};
</script>
<style>

</style>


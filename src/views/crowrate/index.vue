<template>
  <div class="app-container">
    <div class="filter-container" style=" margin-top: 0px;">
      <el-row>
        <label  class="postInfo-container-item">始发机场:</label>
        <el-input v-model="condition.dep" style="width: 120px;" class="filter-item"/>
        <el-button class="filter-item" type="primary"  icon="el-icon-sort" style="-webkit-transform: rotate(90deg); transform: rotate(90 deg); padding:5px; height:40px;width:35px" @click="getTrade"></el-button>
        <label class="postInfo-container-item">到达机场:</label>
        <el-input v-model="condition.arr" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">航班号:</label>
        <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">日期:</label>
        <el-date-picker
          type="daterange"
          v-model="time"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
           @change="dataSearch"
          style="width: 230px;"
        ></el-date-picker>
        </el-row>
        <el-row>
          <label class="postInfo-container-item">采集时间:</label>
        <el-date-picker
          type="daterange"
          v-model="grabtime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
           @change="dataSearch"
          style="width: 230px;"
        ></el-date-picker>
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="getList">查询</el-button>
        <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="outElsx"
        >导出</el-button>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      empty-text
      :row-style="rowClass"
      :cell-style="cellClass"
      height="420px"
      style="width: 100%"
      
    >
      <!-- <el-table-column fixed prop="futureID" align="center" label="序号" width="100"></el-table-column> -->
      <el-table-column fixed align="center" label="日期" min-width="110">
        <template slot-scope="scope">{{dateFormat(scope.row.tongjiDate)}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="航段" min-width="130">
        <template slot-scope="scope">{{scope.row.ori}}-{{scope.row.arrival}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="起飞时间" min-width="110">
        <template slot-scope="scope">{{timeFormat(scope.row.oritime)}}</template>
      </el-table-column>

      <el-table-column fixed prop="flightNo" align="center" label="航班号" min-width="110"></el-table-column>
      <el-table-column fixed prop="layout" align="center" label="布局" min-width="110"></el-table-column>
      <el-table-column prop="kezuoRate" align="center" label="客座率" min-width="110"></el-table-column>
      <el-table-column prop="addtime" align="center" label="采集时间" min-width="150"></el-table-column>
      <!-- <el-table-column prop="lowestPrice" align="center" label="价格" min-width="110"></el-table-column> -->
      <!-- <el-table-column prop="lowestPriceChange" align="center" label="价格变化" min-width="110"></el-table-column>

      <el-table-column prop="passengerChange" align="center" label="上客速度" min-width="100"></el-table-column> -->
      <!-- <el-table-column prop="addTime" align="center" label="入库日期" width="260"></el-table-column> -->
        <div slot="empty">
          <p>
            <label/>
          </p>
        </div>
    </el-table>
    <div style="float: right;">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="condition.pageIndex"
        :limit.sync="condition.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { CrowRate } from "@/api/ajax.js";
import { formatDate} from '@/utils/datefarmate'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      downloadLoading: false,
      total: 0,
      time: [new Date(), new Date().setDate(new Date().getDate() + 15)],
       grabtime: [new Date(), new Date()],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNO: ""
      },
      tableData: null
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
    dateFormat: function(flightDate) {
      if(flightDate==null){
        return null;
      }
      var t = new Date(flightDate); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
    },

    timeFormat: function(column) {
      if(column==null){
        return null;
      }
      let h;
      let m;
      var t = new Date(column); //row 表示一行数据, updateTime 表示要格式化的字段名称
      let hour = t.getHours();
      if(hour < 10) {
      h = "0" + hour;
      } else {
      h = hour;
      }
      let minutes=t.getMinutes();
      if(minutes < 10) {
      m = "0" + minutes;
      } else {
      m = minutes;
      }
      return h + ":" + m;
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
      if( oneTime + 3600 * 1000 * 24 * 31 < twoTime){
           this.$message({message: "时间间隔不能大于31天",type: "warning"});
      }
    },
    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");
      if(!this.condition.dep && !this.condition.arr && !this.condition.flightNO){
         this.$message({message: "请输入始发城市或目的城市或填写航班号",type: "warning"});
          return false;
      }
      if (this.condition.dep) {
        if (!reg1.test(this.condition.dep.toUpperCase())) {
           this.$message({message: "始发机场必须为三字符",type: "warning"});

          return false;
        }
        this.condition.dep.toUpperCase();
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
           this.$message({message: "目的机场必须为三字符",type: "warning"});
          return false;
        }
        this.condition.arr.toUpperCase();
      }
       if (this.condition.flightNO) {
        if (this.condition.flightNO.indexOf(";") != -1) {
          let strs = this.condition.flightNO.split(";");
          if (strs.length > 6) {
               this.$message({ message: "最多只能航班号填六组航班号", type: "warning" });
            return false;
          } else {
            strs.forEach(item => {
              if (!reg2.test(item)) {
                this.$message({ message: "航班号必须为六位字符", type: "warning" });
                return false;
              }
            });
          }
        } else {
          if (!reg2.test(this.condition.flightNO)) {
             this.$message({ message: "航班号必须为六位字符", type: "warning" });
            return false;
          }
        }
        this.condition.flightNo;
      }
       if(this.time){
        var oneTime = new Date().setTime(new Date(this.time[0]).getTime());
        var twoTime = new Date().setTime(new Date(this.time[1]).getTime());
        if( oneTime + 3600 * 1000 * 24 * 31 < twoTime){
            this.$message({message: "时间间隔不能大于31天",type: "warning"});
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
      if (t.grabtime && t.grabtime.length) {
        o["grabDateStart"] = formatDate(t["grabtime"][0], "yyyy-MM-dd")+" 00:00:00";
        o["grabDateEnd"] = formatDate(t["grabtime"][1], "yyyy-MM-dd")+" 23:59:59";
      }
      CrowRate(o)
        .then(response => {
          if (response.data.code == "0") {
            this.tableData = response.data.data;
            this.total = response.data.count;
          } else {
            this.tableData = [];
            this.total = 0;
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
    outElsx() {
      if (!this.validate()) {
        return;
      }
      this.downloadLoading = true;
      let params={};
      let t = this, o = t.condition;
      if (t.time && t.time.length) {
        params["flightDate"] = formatDate(t["time"][0], "yyyy-MM-dd");
        params["flightDateEnd"] = formatDate(t["time"][1], "yyyy-MM-dd");
      }
      if (t.grabtime && t.grabtime.length) {
        params["grabDateStart"] = formatDate(t["grabtime"][0], "yyyy-MM-dd")+" 00:00:00";
        params["grabDateEnd"] = formatDate(t["grabtime"][1], "yyyy-MM-dd")+" 23:59:59";
      }
      params.dep=o.dep;
      params.arr=o.arr;
      params.flightNO=o.flightNO;
      params.pageIndex=1;
      params.pageSize=50000;
      CrowRate(params)
        .then(response => {
          if (response.data.code == "0") {
            let datas = response.data.data;
            this.exportData(datas);
          } else {
            this.$message({ message: "获取列表失败", type: "error" });
          }
          this.downloadLoading = false;
        })
        .catch(err => {
          this.downloadLoading = false;
          console.log(err);
          this.$message({ message: "获取列表失败", type: "error" });
        });
    },
    exportData(datas) {
      let table = [];
      datas.forEach(element => {
        element.aim = element.ori + "-" + element.arrival;
        if (element.tongjiDate) {
          element.tongjiDate = this.dateFormat(element.tongjiDate);
        }
        if (element.oritime) {
          element.oritime = this.timeFormat(element.oritime);
        }
        table.push(element);
      });
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "日期",
          "航段",
          "起飞时间",
          "航班号",
          "布局",
          "客座率",
          "采集时间"
        ];
        const filterVal = [
          "tongjiDate",
          "aim",
          "oritime",
          "flightNo",
          "layout",
          "kezuoRate",
          "addtime"
        ];
        const list = table;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+"航班客座率查询"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      debugger;
      return jsonData.map(v =>
        filterVal.map(j => {
            return v[j];
        })
      );
    }
  }
};
</script>
<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>


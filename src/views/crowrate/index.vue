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
        <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="航段" min-width="130">
        <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="起飞时间" min-width="110">
        <template slot-scope="scope">{{timeFormat(scope.row.depTime)}}</template>
      </el-table-column>

      <el-table-column fixed prop="flightNo" align="center" label="航班号" min-width="110"></el-table-column>
      <el-table-column fixed prop="layout" align="center" label="布局" min-width="110"></el-table-column>
      <el-table-column prop="crowRate" align="center" label="客座率" min-width="110"></el-table-column>
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
import { RepFutureFlightSell } from "@/api/ajax.js";
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
          swal({ title: "提示", text: "始发机场必须为三字符" });
          return false;
        }
        this.condition.dep.toUpperCase();
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
          swal({ title: "提示", text: "目的机场必须为三字符" });
          return false;
        }
        this.condition.arr.toUpperCase();
      }
      if (this.condition.flightNO) {
        if (this.condition.flightNO.indexOf(";") === "-1") {
          let strs = this.condition.flightNO.split(";");
          if (strs.length > 6) {
            swal({ title: "提示", text: "最多只能航班号填六组航班号" });
            return false;
          } else {
            strs.forEach(item => {
              if (!reg2.test(item.flightNO.toUpperCase())) {
                swal({ title: "提示", text: "航班号必须为六位字符" });
                return false;
              }
            });
          }
        } else {
          if (!reg2.test(this.condition.flightNO.toUpperCase())) {
            swal({ title: "提示", text: "航班号必须为六位字符" });
            return false;
          }
        }
        this.condition.flightNo.toUpperCase();
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
        o["startFlightDate"] = formatDate(t["time"][0], "yyyy-MM-dd")+" 00:00:00";
        o["endFlightDate"] = formatDate(t["time"][1], "yyyy-MM-dd")+" 23:59:59";
      }
      RepFutureFlightSell(o)
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
      this.downloadLoading = true;
      let table = [];
      this.tableData.forEach(element => {
        element.aim = element.dep + "-" + element.arr;
        if (element.flightDate) {
          element.flightDate = this.dateFormat(element.flightDate);
        }
        if (element.depTime) {
          element.depTime = this.timeFormat(element.depTime);
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
          "价格",
          "价格变化",
          "客座率",
          "上客速递",
          "入库日期"
        ];
        const filterVal = [
          "flightDate",
          "aim",
          "depTime",
          "flightNo",
          "layout",
          "lowestPrice",
          "lowestPriceChange",
          "crowRate",
          "passengerChange",
          "addTime"
        ];
        const list = table;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "未来航班销售监控"
          // autoWidth: this.autoWidth,
          // bookType: this.bookType
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


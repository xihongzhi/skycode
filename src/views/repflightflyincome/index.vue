<template>
  <div class="app-container">
    <div class="filter-container" style=" margin-top: 0px;">
      <label  class="postInfo-container-item">始发城市:</label>
      <el-input v-model="condition.dep" style="width: 120px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-sort" style="-webkit-transform: rotate(90deg); transform: rotate(90 deg);padding:5px; height:40px;width:35px" @click="getTrade"></el-button>
      <label class="postInfo-container-item">目的城市:</label>
      <el-input v-model="condition.arr" style="width: 120px;" class="filter-item"/>
      <label class="postInfo-container-item">航班号:</label>
      <el-input v-model="condition.flightNo" style="width: 120px;" class="filter-item"/>
      <label class="postInfo-container-item">日期:</label>
      <!-- <el-date-picker
        v-model="condition.flightDate"
        type="date"
        value-format=" yyyy-MM-dd"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        style="width:150px"
      ></el-date-picker> -->
         <el-date-picker
          type="daterange"
          v-model="time"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
           @change="dataSearch"
          style="width: 230px;"
        ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search"  @click="getList">查询</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="outElsx"
      >导出</el-button>
    </div>
    <div class="table-responsive">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        border
        fit
        highlight-current-row
        empty-text
        height="435px"
        style="width: 100%"
        :row-style="rowClass"
        :cell-style="cellClass"
      >
        <el-table-column fixed prop="flightNO" align="center" label="航班号" min-width="80"></el-table-column>
        <el-table-column fixed prop="dep" align="center" label="始发" min-width="60"></el-table-column>
        <el-table-column fixed prop="arr" align="center" label="目的" min-width="60"></el-table-column>
        <el-table-column fixed label="旅行日期" align="center" min-width="100">
          <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
        </el-table-column>
        <el-table-column fixed align="center" label="起飞时间" min-width="80">
          <template slot-scope="scope">{{timeFormat(scope.row.depTime)}}</template>
        </el-table-column>
        <el-table-column prop="flightstyle" align="center" label="机型" min-width="90"></el-table-column>
        <el-table-column prop="flightTime" align="center" label="飞行时间" min-width="80"></el-table-column>
        <el-table-column prop="flightDistance" align="center" label="公里数" min-width="70"></el-table-column>
        <el-table-column prop="passagerCount" align="center" label="乘客人数" min-width="80"></el-table-column>
        <el-table-column prop="layoutNumber" align="center" label="布局数" min-width="70"></el-table-column>
        <el-table-column prop="flightIncome" align="center" label="航班收入" min-width="80"></el-table-column>
        <el-table-column prop="crowdRate" align="center" label="客座率" min-width="70"></el-table-column>
        <el-table-column prop="everyTimeIncome" align="center" label="小时收入" min-width="100"></el-table-column>
        <el-table-column prop="everyPassagerDistanceIncome" align="center" label="客公里收入" min-width="100"></el-table-column>
        <el-table-column prop="everyLayoutDistanceIncome" align="center" label="座公里收入" min-width="100"></el-table-column>
        <!-- <el-table-column prop="layoutDistance" align="center" label="座公里" width="120"></el-table-column>
        <el-table-column prop="passagerDistance" align="center" label="客公里" width="120"></el-table-column> -->
        <!-- fixed="right" -->
        <el-table-column label="操作" min-width="70">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>

        <div slot="empty">
          <p>
            <label/>
          </p>
        </div>
      </el-table>
    </div>
    <div style="float: right;">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="condition.pageIndex"
        :limit.sync="condition.pageSize"
        @pagination="getList"
      />
    </div>
    <el-dialog :visible.sync="dialogVisible" title="明细">
      <div class="table-responsive">
        <el-table
          :data="detailtableData"
          v-loading="detaillistLoading"
          border
          fit
          highlight-current-row
          height:400px
          style="width:100% "
          :row-style="rowClass"
          :cell-style="cellClass"
        >
          <el-table-column prop="flightNo" label="航班号" min-width="80"></el-table-column>
          <el-table-column fixed label="日期" align="center" min-width="80">
            <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
         </el-table-column>
          <el-table-column prop="dep" label="始发" min-width="60"></el-table-column>
          <el-table-column prop="arr" label="目的" min-width="60"></el-table-column>
          <el-table-column prop="class" label="舱位" min-width="80"></el-table-column>
          <el-table-column prop="flightIncome" label="收入" min-width="80"></el-table-column>
          <el-table-column prop="passagerCount" label="人数" min-width="80"></el-table-column>
          <el-table-column prop="averagePrice" label="均价" min-width="80"></el-table-column>
        </el-table>
         <pagination
        v-show="detailtotal>0"
        :total="detailtotal"
        :page.sync="detailcondition.pageIndex"
        :limit.sync="detailcondition.pageSize"
        @pagination="getDetailList"
      />
      </div>
    </el-dialog>
  </div>
</template>

 <script>
import Pagination from "@/components/Pagination";
import { deepClone } from "@/utils";
import { formatDate } from '@/utils/datefarmate'
import { RepFlightflyIncome, RepFlightflyIncomeDetail } from "@/api/ajax.js";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      downloadLoading: false,
      detaillistLoading: false,
      listLoading: false,
      dialogVisible: false,
      total: 0,
      time: [new Date().setDate(new Date().getDate()-1), new Date().setDate(new Date().getDate()-1)],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNo: "",
      },
      tableData: null,
      detailcondition: {
        pageIndex: 1,
        pageSize: 10,
        flightNo: "",
        dep: "",
        arr: "",
        flightDate:""
      },
      detailtableData: null,
      detailtotal: 0,
    };

  },
  mounted() {
    //this.getList();
  },
  methods: {
     rowClass: function (row, index) {
      return { "height": "34px" }
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
      var t = new Date(column); //row 表示一行数据, updateTime 表示要格式化的字段名称
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
      if(!this.condition.dep && !this.condition.arr && !this.condition.flightNo){
         this.$message({message: "请输入始发城市或目的城市或填写航班号",type: "warning"});
          return false;
      }
      if (this.condition.dep) {
        if (!reg1.test(this.condition.dep.toUpperCase())) {
          this.$message({ message: "始发城市必须为三字符", type: "warning" });
          return false;
        }
        this.condition.dep.toUpperCase();
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
          this.$message({ message: "目的城市必须为三字符", type: "warning" });
          return false;
        }
        this.condition.arr.toUpperCase();
      }
      if (this.condition.flightNo) {
        if (this.condition.flightNo.indexOf(";") === "-1") {
          let strs = this.condition.flightNo.split(";");
          if (strs.length > 6) {
            this.$message({
              message: "最多只能航班号填六组航班号",
              type: "warning"
            });
            return false;
          } else {
            strs.forEach(item => {
              if (!reg2.test(item.flightNo.toUpperCase())) {
                this.$message({
                  message: "航班号必须为六位字符",
                  type: "warning"
                });
                return false;
              }
            });
          }
        } else {
          if (!reg2.test(this.condition.flightNo.toUpperCase())) {
            this.$message({ message: "航班号必须为六位字符", type: "warning" });
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
      debugger;
      this.listLoading = true;
      let t = this, o = t.condition;
      if (t.time && t.time.length) {
        o["flightDate"] = formatDate(t["time"][0], "yyyy-MM-dd")+" 00:00:00";
        o["flightDateEnd"] = formatDate(t["time"][1], "yyyy-MM-dd")+" 23:59:59";
      }

      RepFlightflyIncome(o)
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
        if (element.flightDate) {
          element.flightDate = this.dateFormat(element.flightDate);
          element.depTime = this.timeFormat(element.flightDate);
        }
        table.push(element);
      });
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "航班号",
          "始发",
          "目的",
          "旅行时间",
          "起飞时间",
          "机型",
          "飞行时间",
          "公里数",
          "乘客人数",
          "布局数",
          "航班收入",
          "客座率",
          "小时收入",
          "客公里收入",
          "座公里收入",
          "座公里",
          "客公里"
        ];
        const filterVal = [
          "flightNO",
          "dep",
          "arr",
          "flightDate",
          "depTime",
          "flightstyle",
          "flightTime",
          "flightDistance",
          "passagerCount",
          "layoutNumber",
          "flightIncome",
          "crowdRate",
          "everyTimeIncome",
          "everyPassagerDistanceIncome",
          "everyLayoutDistanceIncome",
          "layoutDistance",
          "passagerDistance"
        ];
        const list = table;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "承运航班收入数据"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    handleClick(scope) {
      this.dialogVisible = true;
      let row = deepClone(scope.row);
      // this.detailcondition.rid=row.incomeID;
      this.detailcondition.flightNo = row.flightNO;
       this.detailcondition.dep = row.dep;
       this.detailcondition.arr=row.arr;
       this.detailcondition.flightDate=row.flightDate;
      this.getDetailList();
    },
    getDetailList() {
      let t = this;
       this.detaillistLoading = true;
      RepFlightflyIncomeDetail(t.detailcondition)
        .then(response => {
          if (response.data.code == "0") {
            debugger;
            this.detailtableData = response.data.data;
            this.detailtotal = response.data.count;
          } else {
            this.detailtableData = [];
            this.detailtotal = 0;
            this.$message({ message: "获取列表失败", type: "error" });
          }
           this.detaillistLoading = false;
        })
        .catch(err => {
          console.log(err);
           this.detaillistLoading = false;
          this.$message({ message: "获取列表失败", type: "error" });
        });
    },
  }
 
};
</script>
<style scoped>
</style>


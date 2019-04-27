<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 0px;">
      <label  class="postInfo-container-item">始发机场:</label>
      <el-input v-model="condition.dep" style="width: 120px;" class="filter-item"/>
      <label class="postInfo-container-item">到达机场:</label>
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
          style="width: 230px;"
        ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="outElsx"
      >导出</el-button>
    </div>
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
      <el-table-column fixed align="center" label="航段" min-width="100">
        <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="旅行日期" min-width="80">
        <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="起飞时间" min-width="80">
        <template slot-scope="scope">{{timeFormat(scope.row.depTime)}}</template>
      </el-table-column>
      <el-table-column fixed prop="flightNO" align="center" label="航班号" min-width="80"></el-table-column>
      <el-table-column fixed prop="layout" align="center" label="布局" min-width="60"></el-table-column>
      <el-table-column align="center" label="上客速度">
        <el-table-column prop="d0" align="center" label="0" min-width="60"></el-table-column>
        <el-table-column prop="d1" align="center" label="1" min-width="60"></el-table-column>
        <el-table-column prop="d2" align="center" label="2" min-width="60"></el-table-column>
        <el-table-column prop="d3" align="center" label="3" min-width="60"></el-table-column>
        <el-table-column prop="d4" align="center" label="4" min-width="60"></el-table-column>
        <el-table-column prop="d5" align="center" label="5" min-width="60"></el-table-column>
        <el-table-column prop="d6" align="center" label="6" min-width="60"></el-table-column>
        <el-table-column prop="d7" align="center" label="7" min-width="60"></el-table-column>
        <el-table-column prop="dOut" align="center" label="7+" min-width="60"></el-table-column>
      </el-table-column>
      <!-- <el-table-column :label="this.condition.flightDate" align="center"> -->
      <el-table-column label="CTRIP" align="center">
        <el-table-column align="center" label="最低价" min-width="80">
           <template slot-scope="scope">
             <el-button @click="handleClick(scope)" type="text" size="small">{{scope.row.lowestPrice}}</el-button>
            </template> 
        </el-table-column>
        <el-table-column prop="lowestPriceChange" align="center" label="价格变化" min-width="80"></el-table-column>
        <el-table-column prop="grabLowestPriceTime" align="center" label="采集时间" min-width="90"></el-table-column>
      </el-table-column>
      <el-table-column label="销售数" align="center">
        <el-table-column  align="center" label="客座率" min-width="80">
           <template slot-scope="scope">
             <el-button @click="handleClickgrapResult(scope)" type="text" size="small">{{scope.row.crowRate}}</el-button>
            </template> 
        </el-table-column>
        <el-table-column prop="passagerNumber" align="center" label="人数" min-width="60"></el-table-column>
        <el-table-column prop="grabCrowRateTime" align="center" label="采集时间" min-width="90"></el-table-column>
      </el-table-column>
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

    <el-dialog :visible.sync="dialogVisible" title="最低价采集日志">
      <div class="table-responsive">
        <el-table
          :data="detailtableData"
          :span-method="objectSpanMethod"
          v-loading="detaillistLoading"
           border
          fit
          highlight-current-row
          height:400px
          style="width:100% "
          :row-style="rowClass"
          :cell-style="cellClass"
        >
          <el-table-column label="航段" min-width="100">
             <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
          </el-table-column>
          <el-table-column prop="flightNo" label="航班号" min-width="80"></el-table-column>
          <el-table-column prop="grabTime" label="采集时间" align="center" min-width="120"></el-table-column>
          <el-table-column prop="price" label="最低价" min-width="80"></el-table-column>
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

    
    <el-dialog :visible.sync="grabResultVisible" title="客座率采集日志">
      <div class="table-responsive">
        <el-table
          :data="grabResultData"
          :span-method="objectSpanMethod"
          v-loading="grabResultLoading"
          border
          fit
          highlight-current-row
          height:400px
          style="width:100% "
          :row-style="rowClass"
          :cell-style="cellClass"
        >
         <el-table-column  label="航段" min-width="100">
             <template slot-scope="scope">{{scope.row.ori}}-{{scope.row.arrival}}</template>
          </el-table-column>
          <el-table-column prop="flightNo" label="航班号" min-width="80"></el-table-column>
          <el-table-column prop="addtime" label="采集时间" align="center" min-width="120"></el-table-column>
          <el-table-column prop="kezuoRate" label="客座率" min-width="80"></el-table-column>
        </el-table>
        <pagination
            v-show="grabResulttotal>0"
            :total="grabResulttotal"
            :page.sync="detailcondition.pageIndex"
            :limit.sync="detailcondition.pageSize"
            @pagination="gepResultList"
          />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { RepCompetingFlights,CrowRateSameDayDetail,LowestPriceSameDayDetail } from "@/api/ajax.js";
import { parseTime,deepClone } from "@/utils";
import { formatDate } from '@/utils/datefarmate'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: null,
      total: 0,
      listLoading: false,
      downloadLoading: false,
      time: [new Date().setDate(new Date().getDate()-1), new Date().setDate(new Date().getDate()-1)],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNo: ""
      },
      detailcondition: {
        pageIndex: 1,
        pageSize: 10,
        flightNo: "",
        dep: "",
        arr: ""
      },
       grepcondition: {
        pageIndex: 1,
        pageSize: 10,
        flightNo: "",
        dep: "",
        arr: ""
      },
       detailtotal:0,
       dialogVisible: false,
       detaillistLoading: false,
       detailtableData: null,
       grabResulttotal:0,
       grabResultVisible:false,
       grabResultLoading:false,
       grabResultData:null
    };
  },
  mounted() {
  //  this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 50;
   // this.getList();
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
    //携程最低价当天抓取明细
   handleClick(scope) {
      this.dialogVisible = true;
       let row = deepClone(scope.row);
       this.detailcondition.flightNo = row.flightNO;
       this.detailcondition.dep = row.dep;
       this.detailcondition.arr=row.arr;
       this.getDetailList();
    },
   
   //客座率当天抓取明细
   handleClickgrapResult(scope) {
     debugger;
       this.grabResultVisible = true;
       let row = deepClone(scope.row);
       this.grepcondition.flightNo = row.flightNO;
       this.grepcondition.dep = row.dep;
       this.grepcondition.arr=row.arr;
      this.gepResultList();
    },
    //携程最低价当天抓取明细
    getDetailList() {
      let t = this;
      debugger;
       this.detaillistLoading = true;
      LowestPriceSameDayDetail(t.detailcondition)
        .then(response => {
          debugger;
          if (response.data.code == "0") {
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
    //客座率当天抓取明细
   gepResultList() {
      let t = this;
      debugger;
       this.grabResultLoading = true;
      CrowRateSameDayDetail(t.detailcondition)
        .then(response => {
          if (response.data.code == "0") {
            this.grabResultData = response.data.data;
            this.grabResulttotal = response.data.count;
          } else {
            this.grabResultData = [];
            this.grabResulttotal = 0;
            this.$message({ message: "获取列表失败", type: "error" });
          }
           this.grabResultLoading = false;
        })
        .catch(err => {
          console.log(err);
           this.grabResultLoading = false;
          this.$message({ message: "获取列表失败", type: "error" });
        });
    },

    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");
      if (this.condition.dep) {
        if (!reg1.test(this.condition.dep.toUpperCase())) {
          this.$message({
            message: "始发机场必须为三字符",
            type: "warning"
          });
          return false;
        }
        this.condition.dep.toUpperCase();
      }
      else{
         this.$message({message: "请输入始发机场",type: "warning"});
          return false;
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
          this.$message({ message: "目的机场必须为三字符", type: "warning" });
          return false;
        }
        this.condition.arr.toUpperCase();
      }
      else{
         this.$message({message: "请输入到达机场",type: "warning"});
          return false;
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
      }
      // if (!this.condition.flightDate) {
      //    this.$message({message: "请选择日期",type: "warning"});
      //     return false;
      //  }
      return true;
    },

    getList() {
      if (!this.validate()) {
        return;
      }
      this.listLoading = true;
      let t = this, o = t.condition;
      if (t.time && t.time.length) {
        o["flightDate"] = formatDate(t["time"][0], "yyyy-MM-dd")+" 00:00:00";
        o["flightDateEnd"] = formatDate(t["time"][1], "yyyy-MM-dd")+" 23:59:59";
      }
      debugger;
      RepCompetingFlights(o)
        .then(response => {
          if (response.data.code == "0") {
            this.tableData = response.data.data;
            debugger;
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      debugger;
        if (columnIndex === 0) {
         // if (rowIndex % 2 === 0) {
            return {
              rowspan: 1,
              colspan: 1
            };
          // } else {
          //   return {
          //     rowspan: 0,
          //     colspan: 0
          //   };
          // }
        }
    },
    outElsx() {
      this.downloadLoading = true;
      let table = [];
      this.tableData.forEach(element => {
        debugger
        element.aim = element.dep + "-" + element.dep;
        table.push(element);
      });
      import("@/vendor/Export2Excel").then(excel => {
        const multiHeader = [
          [
            "航段",
            "旅行日期",
            "起飞时间",
            "航班号",
            "布局",
            "上客速度",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "CTRIP",
            "",
            "",
            "销售数",
            "",
            ""
          ]
        ];
        const header = [
          "",
          "",
          "",
          "",
          "",
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "7+",
          "最低价",
          "价格变化",
          "采集时间",
          "客座率",
          "人数",
          "采集时间"
        ];
        const filterVal = [
          "aim",
          "flightDate",
          "depTime",
          "flightNO",
          "layout",
          "d0",
          "d1",
          "d2",
          "d3",
          "d4",
          "d5",
          "d6",
          "d7",
          "dOut",
          "lowestPrice",
          "lowestPriceChange",
          "grabLowestPriceTime",
          "crowRate",
          "passagerNumber",
          "grabCrowRateTime"
        ];
        const list = table;
        const data = this.formatJson(filterVal, list);
        const merges = ["A1:A2", "B1:B2", "C1:C2", "D1:D2","E1:E2", "F1:N1", "O1:Q1","R1:T1"];
        excel.export_json_to_excel({
          multiHeader,
          header,
          merges,
          data,
          filename: "未来航班上客速度"
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
    }
  }
};
</script>
<style scoped>
</style>


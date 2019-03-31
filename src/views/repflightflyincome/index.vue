<template>
  <div class="app-container">
    <div class="filter-container" style=" margin-top: 10px;">
      <label label-width="45px" class="postInfo-container-item">始发城市:</label>
      <el-input v-model="condition.dep" style="width: 200px;" class="filter-item"/>
      <label class="postInfo-container-item">目的城市:</label>
      <el-input v-model="condition.arr" style="width: 200px;" class="filter-item"/>
      <label class="postInfo-container-item">航班号:</label>
      <el-input v-model="condition.flightNo" style="width: 200px;" class="filter-item"/>
      <label class="postInfo-container-item">旅行日期:</label>
      <el-date-picker
        v-model="condition.flightDate"
        type="date"
        value-format=" yyyy-MM-dd"
        format="yyyy-MM-dd"
        placeholder="选择日期"
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
    <div class="table-responsive">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        border
        fit
        highlight-current-row
        empty-text
        height="580px"
        style="width: 100%"
      >
        <el-table-column fixed prop="flightNO" align="center" label="航班号" width="150"></el-table-column>
        <el-table-column fixed prop="dep" align="center" label="始发" width="120"></el-table-column>
        <el-table-column fixed prop="arr" align="center" label="目的" width="120"></el-table-column>
        <el-table-column fixed label="旅行日期" align="center" width="120">
          <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
        </el-table-column>
        <el-table-column fixed align="center" label="起飞时间" width="120">
          <template slot-scope="scope">{{timeFormat(scope.row.flightDate)}}</template>
        </el-table-column>
        <el-table-column prop="flightstyle" align="center" label="机型" width="120"></el-table-column>
        <el-table-column prop="flightTime" align="center" label="飞行时间" width="120"></el-table-column>
        <el-table-column prop="flightDistance" align="center" label="公里数" width="120"></el-table-column>
        <el-table-column prop="passagerCount" align="center" label="乘客人数" width="120"></el-table-column>
        <el-table-column prop="layoutNumber" align="center" label="布局数" width="120"></el-table-column>
        <el-table-column prop="flightIncome" align="center" label="航班收入" width="120"></el-table-column>
        <el-table-column prop="crowdRate" align="center" label="客座率" width="120"></el-table-column>
        <el-table-column prop="everyTimeIncome" align="center" label="小时收入" width="120"></el-table-column>
        <el-table-column prop="everyPassagerDistanceIncome" align="center" label="客公里收入" width="120"></el-table-column>
        <el-table-column prop="everyLayoutDistanceIncome" align="center" label="座公里收入" width="120"></el-table-column>
        <el-table-column prop="layoutDistance" align="center" label="座公里" width="120"></el-table-column>
        <el-table-column prop="passagerDistance" align="center" label="客公里" width="120"></el-table-column>
        <!-- fixed="right" -->
        <el-table-column label="操作" width="100">
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
          height:550px
          style="width:100% "
        >
          <el-table-column prop="flightNo" label="航班号" width="120"></el-table-column>
          <el-table-column prop="flightDate" label="日期" :formatter="dateFormat" width="120"></el-table-column>
          <el-table-column prop="dep" label="始发" width="120"></el-table-column>
          <el-table-column prop="arr" label="目的" width="120"></el-table-column>
          <el-table-column prop="class" label="舱位" width="120"></el-table-column>
          <el-table-column prop="flightIncome" label="收入" width="120"></el-table-column>
          <el-table-column prop="passagerCount" label="人数" width="120"></el-table-column>
          <el-table-column prop="averagePrice" label="均价" width="120"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

 <script>
import Pagination from "@/components/Pagination";
import { deepClone } from "@/utils";
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
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNo: "",
        flightDate: new Date()
      },
      tableData: null,
      detailcondition: {
        flightNo: ""
      },
      detailtableData: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    dateFormat: function(flightDate) {
      var t = new Date(flightDate); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
    },
    timeFormat: function(column) {
      var t = new Date(column); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getHours() + ":" + t.getMinutes();
    },
    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");
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
      }
      return true;
    },

    getList() {
      if (!this.validate()) {
        return;
      }
      let t = this;
      this.listLoading = true;
      RepFlightflyIncome(t.condition)
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
          filename: "1天承运航班收入"
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
      this.detailcondition.flightNo = row.flightNo;
      this.getDetailList();
    },
    getDetailList() {
      let t = this;
      // this.detaillistLoading = true;
      RepFlightflyIncomeDetail(t.detailcondition)
        .then(response => {
          if (response.data.code == "0") {
            this.tableData = response.data.data;
            this.total = response.data.count;
          } else {
            this.tableData = [];
            this.total = 0;
            this.$message({ message: "获取列表失败", type: "error" });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message({ message: "获取列表失败", type: "error" });
        });
    }
  }
};
</script>
<style scoped>
</style>


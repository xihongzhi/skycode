<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 0px;">
      <label  class="postInfo-container-item">始发机场:</label>
      <el-input v-model="condition.dep" style="width: 120px;" class="filter-item"/>
      <label class="postInfo-container-item">到达机场:</label>
      <el-input v-model="condition.arr" style="width: 120px;" class="filter-item"/>
      <label class="postInfo-container-item">航班号:</label>
      <el-input v-model="condition.flightNo" style="width: 120px;" class="filter-item"/>
      <label class="postInfo-container-item">旅行日期:</label>
      <el-date-picker
        v-model="condition.flightDate"
        type="date"
        value-format=" yyyy-MM-dd"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        style="width:150px"
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
      <el-table-column fixed align="center" label="起飞时间" min-width="80">
        <template slot-scope="scope">{{timeFormat(scope.row.flightDate)}}</template>
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
      <el-table-column :label="this.condition.flightDate" align="center">
        <el-table-column prop="lowestPrice" align="center" label="CTRIP" min-width="80"></el-table-column>
        <el-table-column prop="lowestPriceChange" align="center" label="价格变化" min-width="80"></el-table-column>
        <el-table-column prop="passagerNumber" align="center" label="人数" min-width="60"></el-table-column>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { RepCompetingFlights } from "@/api/ajax.js";
import { parseTime } from "@/utils";
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
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNo: "",
        flightDate: ""
      }
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
      var t = new Date(flightDate); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
    },
    timeFormat: function(column) {
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
      if (!this.condition.flightDate) {
         this.$message({message: "请选择日期",type: "warning"});
          return false;
       }
      return true;
    },

    getList() {
      if (!this.validate()) {
        return;
      }
      this.listLoading = true;
      RepCompetingFlights(this.condition)
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
        element.aim = element.dep + "-" + element.dep;
        table.push(element);
      });
      import("@/vendor/Export2Excel").then(excel => {
        const multiHeader = [
          [
            "航段",
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
            this.condition.flightDate,
            "",
            ""
          ]
        ];
        const header = [
          "",
          "",
          "",
          "",
          "d0",
          "d1",
          "d2",
          "d3",
          "d4",
          "d5",
          "d6",
          "d7",
          "dOut",
          "CTRIP",
          "价格变化",
          "人数"
        ];
        const filterVal = [
          "aim",
          "flightDate",
          "flightNo",
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
          "passagerNumber"
        ];
        const list = table;
        const data = this.formatJson(filterVal, list);
        const merges = ["A1:A2", "B1:B2", "C1:C2", "D1:D2", "E1:M1", "N1:P1"];
        excel.export_json_to_excel({
          multiHeader,
          header,
          merges,
          data,
          filename: "竞飞航班上客速度"
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


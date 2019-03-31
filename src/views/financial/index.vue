<template>
  <div class="app-container">
    <div class="filter-container" style=" margin-top: 10px;">
      <el-row>
        <label label-width="45px" class="postInfo-container-item">始发机场:</label>
        <el-input v-model="condition.dep" style="width: 200px;" class="filter-item"/>
        <label class="postInfo-container-item">到达机场:</label>
        <el-input v-model="condition.arr" style="width: 200px;" class="filter-item"/>
        <label class="postInfo-container-item">航班号:</label>
        <el-input v-model="condition.flightNo" style="width: 200px;" class="filter-item"/>
      </el-row>
      <el-row>
        <label class="postInfo-container-item">日期:</label>
        <el-date-picker
          type="daterange"
          v-model="time"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
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
      height="580px"
      style="width: 100%"
    >
      <!-- <el-table-column fixed prop="futureID" align="center" label="序号" width="100"></el-table-column> -->
      <el-table-column fixed align="center" label="日期" width="130">
        <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="航段" width="150">
        <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="起飞时间" width="130">
        <template slot-scope="scope">{{timeFormat(scope.row.depTime)}}</template>
      </el-table-column>

      <el-table-column fixed prop="flightNo" align="center" label="航班号" width="130"></el-table-column>
      <el-table-column fixed prop="layout" align="center" label="布局" width="130"></el-table-column>
      <el-table-column prop="lowestPrice" align="center" label="价格" width="130"></el-table-column>
      <el-table-column prop="lowestPriceChange" align="center" label="价格变化" width="130"></el-table-column>
      <el-table-column prop="crowRate" align="center" label="客座率" width="130"></el-table-column>
      <el-table-column prop="passengerChange" align="center" label="上客速度" width="130"></el-table-column>
      <el-table-column prop="addTime" align="center" label="入库日期" width="260"></el-table-column>
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
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      downloadLoading: false,
      total: 0,
      time: [new Date(), new Date().setDate(new Date().getDate() + 15)],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNo: ""
      },
      tableData: null
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

    // dateFormat: function(row, column) {
    //   var t = new Date(row.flightDate); //row 表示一行数据, updateTime 表示要格式化的字段名称
    //   return (
    //     t.getFullYear() +
    //     "-" +
    //     (t.getMonth() + 1) +
    //     "-" +
    //     t.getDate()
    //   );
    // },
    // timeFormat: function(row, column) {
    //   var t = new Date(row.depTime); //row 表示一行数据, updateTime 表示要格式化的字段名称
    //   return (
    //     t.getHours()+
    //     ":"+
    //     t.getMinutes()
    //   );
    // },
    timeFormat: function(column) {
      var t = new Date(column); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getHours() + ":" + t.getMinutes();
    },
    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");
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
      if (this.condition.flightNo) {
        if (this.condition.flightNo.indexOf(";") === "-1") {
          let strs = this.condition.flightNo.split(";");
          if (strs.length > 6) {
            swal({ title: "提示", text: "最多只能航班号填六组航班号" });
            return false;
          } else {
            strs.forEach(item => {
              if (!reg2.test(item.flightNo.toUpperCase())) {
                swal({ title: "提示", text: "航班号必须为六位字符" });
                return false;
              }
            });
          }
        } else {
          if (!reg2.test(this.condition.flightNo.toUpperCase())) {
            swal({ title: "提示", text: "航班号必须为六位字符" });
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
      this.listLoading = true;
      let t = this,
        o = t.condition;
      if (t.time && t.time.length) {
        o["startFlightDate"] = this.formatDate(t["time"][0], "yyyy-MM-dd");
        o["endFlightDate"] = this.formatDate(t["time"][1], "yyyy-MM-dd");
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
    },
    formatDate(time, fmt) {
      let date = time ? (Number(time) && new Date(time)) || time : new Date();
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      let o = {
        "Y+": date.getFullYear(),
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          );
        }
      }
      return fmt;
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
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


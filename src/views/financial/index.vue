<template>
  <div lass="app-container">
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
         <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >查询</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="outElsx"
      >导出</el-button>
      </el-row>
    </div>
    <!-- align="center" -->
       <!-- <el-table-column fixed label="日期" width="130" prop="flightDate" :formatter="dateFormat" > -->
    <el-table :data="tableData" v-loading="listLoading" height="580px" style="width: 100%">
      <el-table-column fixed prop="futureID" label="序号" width="130"></el-table-column>
      <el-table-column fixed label="日期" width="130"  >
         <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
      </el-table-column>
      <el-table-column fixed label="航段" width="150">
        <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
      </el-table-column>
      <el-table-column fixed prop="depTime" label="起飞时间" :formatter="timeFormat" width="130"></el-table-column>
      <el-table-column fixed prop="flightNo" label="航班号" width="130"></el-table-column>
      <el-table-column fixed prop="layout" label="布局" width="130"></el-table-column>
      <el-table-column prop="lowestPrice" label="价格" width="130"></el-table-column>
      <el-table-column prop="lowestPriceChange" label="价格变化" width="130"></el-table-column>
      <el-table-column prop="crowRate" label="客座率" width="130"></el-table-column>
      <el-table-column prop="passengerChange" label="上客速递" width="130"></el-table-column>
      <el-table-column prop="addTime" label="入库日期" width="auto"></el-table-column>
    </el-table>
    <div class="VueTables__search-field ml-auto" style="float: right;">
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
import { parseTime } from "@/utils";
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

      tableTitle: [
        "编号",
        "日期",
        "航班",
        "起飞时间",
        "航班号",
        "布局",
        "价格",
        "价格变化",
        "客座率",
        "上客速递",
        "入库日期"
      ],
      filterData: [
        "futureID",
        "flightDate",
        "dep",
        "depTime",
        "flightNo",
        "layout",
        "lowestPrice",
        "lowestPriceChange",
        "crowRate",
        "passengerChange",
        "addTime"
      ],
      tableData: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    dateFormat:function(flightDate){
      var t = new Date(flightDate); //row 表示一行数据, updateTime 表示要格式化的字段名称
            return (
              t.getFullYear() +
              "-" +
              (t.getMonth() + 1) +
              "-" +
              t.getDate() 
            );
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
    timeFormat: function(row, column) {
      var t = new Date(row.depTime); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return (
        t.getHours()+
        ":"+ 
        t.getMinutes()
      );
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
        debugger;
       o["startFlightDate"] = this.formatDate(t["time"][0], "yyyy-MM-dd");
       o["endFlightDate"] = this.formatDate(t["time"][1], "yyyy-MM-dd");
      }
      RepFutureFlightSell(o)
        .then(response => {
          this.tableData = response.data.data;
          this.total = response.data.count;
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
      let jsonData = this.tableData,
        t = this;
      let str = `${this.tableTitle.join()}\n`;
      for (let i = 0; i < jsonData.length; i++) {
        let a = jsonData[i];
        this.filterData.each(b => {
          if (a.hasOwnProperty(b)) {
            if (b == "futureID")
              return (str += `${!a.futureID ? "" : a.futureID},`);
            if (b == "flightDate")
              return (str += `${!a.flightDate ? "" : a.flightDate},`);
            if (b == "dep")
              return (str += `${!a.dep ? "" : a.dep + "-" + a.arr},`);
            if (b == "depTime")
              return (str += `${!a.depTime ? "" : a.depTime},`);
            if (b == "flightNo")
              return (str += `${!a.flightNo ? "" : a.flightNo},`);
            if (b == "layout") return (str += `${!a.layout ? "" : a.layout},`);
            if (b == "lowestPrice")
              return (str += `${!a.lowestPrice ? "" : a.lowestPrice},`);
            if (b == "lowestPriceChange")
              return (str += `${
                !a.lowestPriceChange ? "" : a.lowestPriceChange
              },`);
            if (b == "crowRate")
              return (str += `${!a.crowRate ? "" : a.crowRate},`);
            if (b == "passengerChange")
              return (str += `${!a.passengerChange ? "" : a.passengerChange},`);
            if (b == "addTime")
              return (str += `${!a.addTime ? "" : a.addTime},`);
            str += `${a[b] ? a[b] : ""},`;
          }
        });
        str += "\n";
      }
      this.downloadLoading = false;
      let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      var link = document.createElement("a");
      link.href = uri;
      link.download = "未来航班销售监控.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // import("@/vendor/Export2Excel").then(excel => {
      //   const data = this.formatJson(filterData, jsonData);
      //   excel.export_json_to_excel({
      //     header: this.tableTitle,
      //     data,
      //     filename: "table-list"
      //   });
      //   this.downloadLoading = false;
      // });
    },

    formatDate(time, fmt) {
    let date = time ? (Number(time) && new Date(time) || time) : new Date();
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'Y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
      }
    }
    return fmt;
  },
   padLeftZero(str) {
    return ('00' + str).substr(str.length);
  }

    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       if (j === "timestamp") {
    //         return parseTime(v[j]);
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // }
  },
};
</script>
<style scoped>
.btn-group {
  border-radius: 8px;
}
.search_r {
  margin-right: 78px;
  position: absolute;
  right: 0;
}
.table {
  text-align: center;
}
.table_bg {
  background: rgba(235, 235, 235, 1);
  border-radius: 3px 3px 0px 0px;
}
</style>


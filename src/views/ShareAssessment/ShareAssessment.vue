<template>
  <ContentWrapper>
    <div class="content-heading">
      <div>-1天承运航班收入</div>
    </div>
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <div data class="row">
          <div data class="col-md-12">
            <div data class="form-group form-inline pull-left VueTables__search">
              <div data class="VueTables__search-field">
                <label data for="VueTables__search_pbgFE">始发城市:</label>
                <input
                  v-model="condition.dep"
                  data
                  type="text"
                  value
                  placeholder
                  class="form-control"
                >
              </div>
              <div data class="VueTables__search-field">
                <label data for="VueTables__search_pbgFE">目的城市:</label>
                <input
                  v-model="condition.arr"
                  data
                  type="text"
                  value
                  placeholder
                  class="form-control"
                >
              </div>
              <div data class="VueTables__search-field">
                <label data for="VueTables__search_pbgFE">航班号:</label>
                <input
                  v-model="condition.flightNo"
                  data
                  type="text"
                  value
                  placeholder
                  class="form-control"
                >
              </div>
              <div data class="VueTables__search-field">
                <label data for="VueTables__search_pbgFE">旅行日期:</label>
                <div class="block" style="display: inline-block;">
                  <el-date-picker
                    v-model="condition.flightDate"
                    type="date"
                    value-format=" yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                  ></el-date-picker>
                </div>
              </div>

              <div class="VueTables__search-field col" style="margin-top:15px;margin-left: 209px;">
                <button type="button" class="btn mr-1 mb-1 btn-info" @click="getList()">查询</button>
                <button type="button" :loading="downloadLoading" class="btn mr-1 mb-1 btn-success" @click="outElsx()">导出</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card card-default">
      <div class="table-responsive">
        <el-table :data="tableData" v-loading="listLoading" style="width: 100%;height:550px">
          <el-table-column fixed prop="flightNO" label="航班号" width="150"></el-table-column>
          <el-table-column fixed prop="dep" label="始发" width="120"></el-table-column>
          <el-table-column fixed prop="arr" label="目的" width="120"></el-table-column>
          <el-table-column fixed prop="flightDate" label="旅行日期" width="120"></el-table-column>
          <el-table-column fixed prop="depTime" label="起飞时间" width="120"></el-table-column>
          <el-table-column prop="flightstyle" label="机型" width="120"></el-table-column>
          <el-table-column prop="flightTime" label="飞行时间" width="120"></el-table-column>
          <el-table-column prop="flightDistance" label="公里数" width="120"></el-table-column>
          <el-table-column prop="passagerCount" label="乘客人数" width="120"></el-table-column>
          <el-table-column prop="layoutNumber" label="布局数" width="120"></el-table-column>
          <el-table-column prop="flightIncome" label="航班收入" width="120"></el-table-column>
          <el-table-column prop="crowdRate" label="客座率" width="120"></el-table-column>
          <el-table-column prop="everyTimeIncome" label="小时收入" width="120"></el-table-column>
          <el-table-column prop="everyPassagerDistanceIncome" label="客公里收入" width="120"></el-table-column>
          <el-table-column prop="everyLayoutDistanceIncome" label="座公里收入" width="120"></el-table-column>
          <el-table-column prop="layoutDistance" label="座公里" width="120"></el-table-column>
          <el-table-column prop="passagerDistance" label="客公里" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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

    <repFlightflyIncomeDetail
      :resetData="resetData"
      v-if="closeAdd"
      v-on:closeAdd="closeAdd = false"
      @setaddSupplierList="setaddSupplierList"
    />
  </ContentWrapper>
</template>

<script>
import repFlightflyIncomeDetail from "@/views/box/repFlightflyIncomeDetail";
import Pagination from "@/components/Pagination";
import {RepFlightflyIncome} from "@/server/ajax.js";
import swal from "sweetalert2";
export default {
  components: {
    Pagination,
    repFlightflyIncomeDetail
  },
  data() {
    return {
      closeAdd: false,
      downloadLoading:false,
      listLoading: false,
      total: 0,
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNo: "",
        flightDate: new Date()
      },

      filterData: [
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
      ],
      tableTitle: [
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
      ],
      tableData:null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleClick(row) {
      this.resetData = row.flightNO;
      this.closeAdd = true;
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
        if (this.condition.flightNo.indexOf(";")==="-1") {
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
      let t=this;
      this.listLoading = true;
      RepFlightflyIncome(t.condition)
        .then(response => {
          this.tableData = response.data.data;
          this.total = response.data.count;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
          this.$message({message: '获取列表失败',type: 'error'});
        });
    },
    outElsx() {
      this.downloadLoading = true
      let jsonData = this.tableData,
        t = this;
      let str = `${this.tableTitle.join()}\n`;
      for (let i = 0; i < jsonData.length; i++) {
        let a = jsonData[i];
        this.filterData.each(b => {
          if (a.hasOwnProperty(b)) {
            if (b == "flightNO")
              return (str += `${!a.flightNO ? "" : a.flightNO},`);
            if (b == "dep") return (str += `${!a.dep ? "" : a.dep},`);
            if (b == "arr") return (str += `${!a.arr ? "" : a.arr},`);
            if (b == "flightDate")
              return (str += `${!a.flightDate ? "" : a.flightDate},`);
            if (b == "depTime")
              return (str += `${!a.depTime ? "" : a.depTime},`);
            if (b == "flightstyle")
              return (str += `${!a.flightstyle ? "" : a.flightstyle},`);
            if (b == "flightTime")
              return (str += `${!a.flightTime ? "" : a.flightTime},`);
            if (b == "flightDistance")
              return (str += `${!a.flightDistance ? "" : a.flightDistance},`);
            if (b == "passagerCount")
              return (str += `${!a.passagerCount ? "" : a.passagerCount},`);
            if (b == "layoutNumber")
              return (str += `${!a.layoutNumber ? "" : a.layoutNumber},`);
            if (b == "flightIncome")
              return (str += `${!a.flightIncome ? "" : a.flightIncome},`);
            if (b == "crowdRate")
              return (str += `${!a.crowdRate ? "" : a.crowdRate},`);
            if (b == "everyTimeIncome")
              return (str += `${!a.everyTimeIncome ? "" : a.everyTimeIncome},`);
            if (b == "everyPassagerDistanceIncome")
              return (str += `${
                !a.everyPassagerDistanceIncome
                  ? ""
                  : a.everyPassagerDistanceIncome
              },`);
            if (b == "everyLayoutDistanceIncome")
              return (str += `${
                !a.everyLayoutDistanceIncome ? "" : a.everyLayoutDistanceIncome
              },`);
            if (b == "layoutDistance")
              return (str += `${!a.layoutDistance ? "" : a.layoutDistance},`);
            if (b == "passagerDistance")
              return (str += `${
                !a.passagerDistance ? "" : a.passagerDistance
              },`);
            str += `${a[b] ? a[b] : ""},`;
          }
        });
        str += "\n";
      }
      this.downloadLoading = true
      let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      var link = document.createElement("a");
      link.href = uri;
      link.download = "-1天承运航班收入.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
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


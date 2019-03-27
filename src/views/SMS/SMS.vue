<template>
  <ContentWrapper>
    <div class="content-heading">
      <div>竞飞航班上客速度</div>
    </div>
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <div data class="row">
          <div data class="col-md-12">
            <div data class="form-group form-inline pull-left VueTables__search">
              <div data class="VueTables__search-field">
                <label data for="VueTables__search_pbgFE">始发机场:</label>
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
                <label data for="VueTables__search_pbgFE">到达机场:</label>
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
                <button
                  type="button"
                  :loading="downloadLoading"
                  class="btn mr-1 mb-1 btn-success"
                  @click="outElsx()"
                >导出</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card card-default">
      <div class="table-responsive">
        <el-table :data="tableData" v-loading="listLoading" style="width: 100%;height:550px">
          <el-table-column fixed label="航段" width="150">
            <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
          </el-table-column>
          <el-table-column fixed label="起飞时间" width="120" prop="flightDate" :formatter="dateFormat">
             <!-- <template slot-scope="scope">{{scope.row.flightDate|format('yyyy-MM-dd')}}</template> -->
          </el-table-column>
          <el-table-column fixed prop="flightNO" label="航班号" width="120"></el-table-column>
          <el-table-column fixed prop="layout" label="布局" width="300"></el-table-column>
          <el-table-column label="上客速度">
            <el-table-column prop="d0" label="0" width="120"></el-table-column>
            <el-table-column prop="d1" label="1" width="120"></el-table-column>
            <el-table-column prop="d2" label="2" width="300"></el-table-column>
            <el-table-column prop="d3" label="3" width="120"></el-table-column>
            <el-table-column prop="d4" label="4" width="120"></el-table-column>
            <el-table-column prop="d5" label="5" width="120"></el-table-column>
            <el-table-column prop="d6" label="6" width="120"></el-table-column>
            <el-table-column prop="d7" label="7" width="120"></el-table-column>
            <el-table-column prop="dOut" label="7+" width="120"></el-table-column>
          </el-table-column>
          <el-table-column :label="this.condition.flightDate">
            <el-table-column prop="lowestPrice" label="CTRIP" width="120"></el-table-column>
            <el-table-column prop="lowestPriceChange" label="价格变化" width="120"></el-table-column>
            <el-table-column prop="passagerNumber" label="人数" width="120"></el-table-column>
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
  </ContentWrapper>
</template>

<script>
import Pagination from "@/components/Pagination";
import { RepCompetingFlights } from "@/server/ajax.js";
import { parseTime } from '@/utils'
//import swal from "sweetalert2";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: null,
      total: 0,
      listLoading: true,
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
    this.getList();
  },
  methods: {
    dateFormat:function(row,column){
      debugger;
        var t=new Date(row.flightDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours();
    },
    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");
      if (this.condition.dep) {
        if (!reg1.test(this.condition.dep.toUpperCase())) {
        //  swal({ title: "提示", text: "始发机场必须为三字符" });
             this.$message({
              message: '始发机场必须为三字符',
              type: 'warning'
            });
          return false;
        }
        this.condition.dep.toUpperCase();
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
         // swal({ title: "提示", text: "目的机场必须为三字符" });
          this.$message({message: '目的机场必须为三字符',type: 'warning'});
          return false;
        }
        this.condition.arr.toUpperCase();
      }
      if (this.condition.flightNo) {
        if (this.condition.flightNo.indexOf(";")==="-1") {
          let strs = this.condition.flightNo.split(";");
          if (strs.length > 6) {
           // swal({ title: "提示", text: "最多只能航班号填六组航班号" });
             this.$message({message: '最多只能航班号填六组航班号',type: 'warning'});
            return false;
          } else {
            strs.forEach(item => {
              if (!reg2.test(item.flightNo.toUpperCase())) {
               // swal({ title: "提示", text: "航班号必须为六位字符" });
                this.$message({message: '航班号必须为六位字符',type: 'warning'});
                return false;
              }
            });
          }
        } else {
          if (!reg2.test(this.condition.flightNo.toUpperCase())) {
            //swal({ title: "提示", text: "航班号必须为六位字符" });
            this.$message({message: '航班号必须为六位字符',type: 'warning'});
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
      RepCompetingFlights(this.condition)
        .then(response => {
          this.tableData = response.data.data;
          this.total = response.data.count;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
          this.$message({message: '获取列表失败',type: 'error'});
          // swal({
          //   title: "错误",
          //   text: "获取列表失败",
          //   timer: 2000
          // });
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
          "lowestPrice",
          "lowestPriceChange",
          "passagerNumber"
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
          data
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


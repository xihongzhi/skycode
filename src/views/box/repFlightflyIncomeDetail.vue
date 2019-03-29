<template>
  <ContentWrapper>
    <div class="box_warp box_warp_store">
      <div class="box-content " style="width: 1000px">
        <div class="content-heading col-xl-12">
          <div class="card-title col-xl-12">
            明细
            <button @click="$emit('closeAdd')" class="btn btn-secondary btn-sm" type="button">
              <em class="fa fa-times text-gray-dark"></em>
            </button>
          </div>
        </div>
        <div class="card card-default">
          <div class="table-responsive" style="overflow-y:scroll;width:100% ;height:600px">
            <el-table :data="tableData" v-loading="listLoading" style="width:100% ;height:550px">
              <el-table-column fixed prop="flightNo" label="航班号" width="120"></el-table-column>
              <el-table-column fixed prop="flightDate" label="日期" width="120">
                
              </el-table-column>
              <el-table-column fixed prop="dep" label="始发"  width="120"></el-table-column>
              <el-table-column fixed prop="arr" label="目的"  width="120"></el-table-column>
              <el-table-column fixed prop="class" label="舱位" width="120"></el-table-column>
              <el-table-column fixed prop="flightIncome" label="收入" width="120"></el-table-column>
              <el-table-column fixed prop="passagerCount" label="人数" width="120"></el-table-column>
              <el-table-column prop="averagePrice" label="均价" width="120"></el-table-column>
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
      </div>
    </div>
  </ContentWrapper>
</template>
<script>
import Pagination from "@/components/Pagination";
import {RepFlightflyIncomeDetail} from "@/api/ajax.js";

export default {
  props: ["resetData"],
  components: {
    Pagination
  },
  data() {
    listLoading: false;
    let data = this.resetData;
    debugger;
    return {
      condition: {
        flightNo:data,
        pageIndex: 1,
        pageSize: 10
      },
      tableData:null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      let t = this;
       RepFlightflyIncomeDetail(t.condition)
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
    }
  }
};
</script>

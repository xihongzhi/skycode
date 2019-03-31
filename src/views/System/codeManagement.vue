<template>
  <ContentWrapper>
    <div class="content-heading">
      <div>三字码维护</div>
    </div>
     <div class="card" style="text-align: center;">
      <div class="card-body">
        <div data class="row">
          <div data class="col-md-12">
            <div data class="form-group form-inline pull-left VueTables__search">
              <div class="style="float: right;" col" style="margin-top:15px;margin-left: 209px;">
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
          <el-table-column fixed prop="flightDate" label="起飞时间" width="120"></el-table-column>
          <el-table-column fixed prop="flightNO" label="航班号" width="120"></el-table-column>
          <el-table-column fixed prop="layout" label="布局" width="300"></el-table-column>
        </el-table>
      </div>
      <div class="style="float: right;" ml-auto" style="float: right;">
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
        pageSize: 10
      }
    };
  },
  methods: {

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
.auto_page{
    margin: 0 auto;
}
</style>

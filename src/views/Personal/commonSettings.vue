<template>
  <ContentWrapper>
    <div class="content-heading">
      <div>公司申请</div>
      <div class="ml-auto" style="margin-right: 79px;">
        <div id="ddown1" class="btn-group b-dropdown dropdown">
          <button
            class="btn mr-1 mb-1 btn-info"
            type="button"
            @click="resetData = {},closeAdd=true"
          >新增</button>
        </div>
      </div>
    </div>
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <div data-v-30cc3fa8 class="row">
          <div data-v-30cc3fa8 class="col-md-12">
            <div data-v-30cc3fa8 class="form-group form-inline pull-left VueTables__search">
              <div data-v-30cc3fa8 class="VueTables__search-field">
                <label data-v-30cc3fa8 for="VueTables__search_pbgFE">状态:</label>
                <div class="btn-group" id="ui_905_5463">
                  <input type="hidden" name="status" value>
                   <button
                    type="button"
                    :class="req.type==''?'btn-info':'btn-secondary'"
                    @click="req.type=''"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >全部</button>
                  <button
                    type="button"
                    :class="req.type=='１'?'btn-info':'btn-secondary'"
                    @click="req.type='１'"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >待受理</button>
                  <button
                    type="button"
                    :class="req.type=='２'?'btn-info':'btn-secondary'"
                    @click="req.type='２'"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >已受理</button>
                  <button
                    type="button"
                    :class="req.type=='３'?'btn-info':'btn-secondary'"
                    @click="req.type='３'"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >受理完成</button>
                  <button
                    type="button"
                    :class="req.type=='４'?'btn-info':'btn-secondary'"
                    @click="req.type='４'"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >不予处理</button>

                  <div style="clear: both"></div>
                </div>
              </div>
              <div class="VueTables__search-field search_r">
                <input
                  data-v-30cc3fa8
                  type="text"
                  value
                  placeholder="公司名称／公司代号"
                  id="VueTables__search_pbgFE"
                  class="form-control"
                >
                <label for style="width:20px;"></label>
                <button type="button" class="btn mr-1 mb-1 btn-info" @click="getPhones">查询</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card card-default">
      <div class="table-responsive">
        <table class="table table-bordered table-hover" id="table-ext-1">
          <thead class="table_bg">
            <tr>
              <th>编号</th>
              <th>联系人</th>
              <th>联系方式</th>
              <th>状态</th>
              <th>受理人</th>
              <th>备注</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-show="resList.length" class="gradeX" v-for="e,i in resList">
              <td>{{e.id}}</td>
              <td>{{e.name}}</td>
              <td>{{e.phone}}</td>
              <td>{{e.status}}</td>
              <td>{{e.auditName}}</td>
              <td>{{e.remark}}</td>
              <td>{{e.createTime}}</td>
              <td>
                <button class="btn mr-1 mb-1 btn-warning" type="button">编辑</button>
              </td>
            </tr>
            <tr v-show="!resList.length">
              <td>——</td>
              <td>——</td>
              <td>——</td>
              <td>——</td>
              <td>——</td>
              <td>——</td>
              <td>——</td>
              <td>
                <button type="button" class="btn mr-1 mb-1 btn-warning" @click="closeAdd=true">编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <addFirm
      :resetData="resetData"
      v-if="closeAdd"
      v-on:closeAdd="closeAdd = false"
      @setAddFirm="setAddFirm"
    />
  </ContentWrapper>
</template>

<script>
import addFirm from "@/views/box/addFirm";
import api from "@/server/app.js";
import swal from "sweetalert2";
export default {
  components: {
    addFirm
  },
  data() {
    return {
      resList: [],
      resetData: {},
      closeAdd: false,
      req: {
        type: "",
        auditId: "",
        auditName: "",
        auditTime: "",
        createTime: "",
        name: "",
        pageQuery: {
          index: 0,
          size: 10
        },
        phone: "",
        remark: "",
        status: ""
      }
    };
  },
  mounted() {
    this.getPhones();
  },
  methods: {
    getPhones() {
      let t = this;
      this.$$.post({
        url: api.Phones,
        data: this.req,
        success(res) {
          t.resList = res;
          console.log(res);
        }
      });
    },
    addcompanyApply_List(result) {
      let t = this;
      this.$$.post({
        url: api.CreateFirm,
        data: this.filterData(result),
        success(res) {},
        fail(err) {
          console.log(err);
        }
      });
    },
    filterData(res) {
      return {
        address: res.address,
        admin: res.admin,
        firmCode: res.firmCode,
        contactMobile: res.code,
        contactName: res.contactName,
        firmName: res.firmName,
        pwd: res.pwd
      };
    },
    resetFirm(data) {
      this.resetData = data;
      this.closeAdd = true;
    },
    setAddFirm(res) {
      let resetIdx = null;
      this.closeAdd = false;
      if (!res.hasOwnProperty("reset")) return this.addcompanyApply_List(res);
      this.reFirm(res);
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


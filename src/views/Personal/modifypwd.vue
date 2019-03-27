<template>
  <ContentWrapper>
    <div class="content-heading">
      <div>公司列表</div>
    </div>
    <div class="card" style="text-align: center;">
      <div class="card-body">
        <div data-v-30cc3fa8 class="row">
          <div data-v-30cc3fa8 class="col-md-12">
            <div data-v-30cc3fa8 class="form-group form-inline pull-left VueTables__search">
              <div data-v-30cc3fa8 class="VueTables__search-field">
                <label data-v-30cc3fa8 for="VueTables__search_pbgFE">类型:</label>
                <div class="btn-group" id="ui_905_5463">
                  <input type="hidden" name="status" value>
                  <button
                    type="button"
                    :class="req.status==''?'btn-info':'btn-secondary'"
                    @click="req.status=''"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >全部</button>
                  <button
                    type="button"
                    :class="req.status=='1'?'btn-info':'btn-secondary'"
                    @click="req.status='1'"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >未禁用</button>
                  <button
                    type="button"
                    :class="req.status=='2'?'btn-info':'btn-secondary'"
                    @click="req.status='2'"
                    class="btn mr-1 mb-1"
                    style="border-radius:8px;"
                  >已禁用</button>

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
                <button type="button" class="btn mr-1 mb-1 btn-info" @click="getFirmInfoList">查询</button>
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
              <th>公司名称</th>
              <th>公司代号</th>
              <th>logo</th>
              <th>联系人</th>
              <th>联系方式</th>
              <th>地址</th>
              <th>管理员账号</th>
              <th>添加时间</th>
              <th>是否禁用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-show="resList.length" class="gradeX" v-for="e,i in resList">
              <td>{{e.code}}</td>
              <td>{{e.name}}</td>
              <td>{{e.areaCode}}</td>
              <td>{{e.logo}}</td>
              <td>{{e.contactName}}</td>
              <td>{{e.contactMobile}}</td>
              <td>{{e.address}}</td>
              <!-- <td>{{e.login.split('_')[1]}}</td> -->
              <td>{{e.login}}</td>
              <td>{{e.createDate}}</td>
              <td>{{e.status == 0?'是':'否'}}</td>
              <td>
                <button
                  class="btn mr-1 mb-1 btn-warning"
                  type="button"
                  @click.prevent="resetpwd"
                >修改/详情</button>
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
              <td>——</td>
              <td>——</td>
              <td>——</td>
              <td>
                <button type="button" class="btn mr-1 mb-1 btn-warning">修改/详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ListAetails v-if="closeAdd" @closeAdd="closeAdd = false"/>
  </ContentWrapper>
</template>

<script>
import ListAetails from "@/views/box/ListAetails.vue";
import api from "@/server/app.js";
import swal from "sweetalert2";
export default {
  components: {
    ListAetails
  },
  data() {
    return {
      resList: [],
      closeAdd: false,
      req: {
        contactMobile: "",
        areaCode: "",
        code: "",
        address: "",
        contactName: "",
        name: "",
        status: "",
        userId:""
      }
    };
  },
  mounted() {
    this.getFirmInfoList();
  },
  methods: {
    getFirmInfoList() {
      let t = this;
      this.$$.post({
        url: api.getFirmInfo,
        data: this.req,
        success(res) {
          t.resList = res;
          console.log(res);
        }
      });
    },
    resetpwd(userId) {
      let t = this;
      swal({
        title: "修改密码",
        html: `  <div>
                      <span>账号：</span>
                      <input type="text"   />
                    </div>
                    <div style="margin-top:20px;">
                      <span>新密码：</span>
                      <input type="password" id="newpwd" />
                    </div>  `,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        preConfirm: function(value) {
          let newpwd = document.getElementById("newpwd").value;
          return new Promise(function(resolve, reject) {
            if (value) {
              RetPwd(userId,newpwd, resolve);
            } else {
              reject("内容不能为空");
            }
          });
        }
      });
      function RetPwd(userId,newpwd, resolve) {
        t.$$.post({
          url: api.resetPassWord + '?userId=' + 83,
          data: {
            // id:this.req.userId,
            // id:this['userId'],
            password: newpwd
          },
          success(res) {
            resolve();
          }
        });
      }
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


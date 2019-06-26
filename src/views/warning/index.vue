<template>
  <div class="app-container">
    <div class="filter-container" style=" margin-top: 0px;">
      <el-row>
        <label  class="postInfo-container-item">始发机场:</label>
        <el-input v-model="condition.dep" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">到达机场:</label>
        <el-input v-model="condition.arr" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">航班号:</label>
        <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">对标航班号:</label>
        <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
        </el-row>
        <el-row>
        <label class="postInfo-container-item">比较项:</label>
         <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
         <label class="postInfo-container-item">通知微信号:</label>
         <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
         <label class="postInfo-container-item">预警编号:</label>
         <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
        <label class="postInfo-container-item">状态 :</label>
         <el-input v-model="condition.flightNO" style="width: 120px;" class="filter-item"/>
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="getList">查询</el-button>
        <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleAdd"
        >添加</el-button>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      empty-text
      :row-style="rowClass"
      :cell-style="cellClass"
      height="420px"
      style="width: 100%">
      <el-table-column fixed align="center" sortable label="预警编号" min-width="110" :sort-method="sortByDate">
        <template slot-scope="scope">{{dateFormat(scope.row.flightDate)}}</template>
      </el-table-column>
      <el-table-column fixed align="center" label="起飞机场" min-width="130">
        <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
      </el-table-column>
        <el-table-column fixed align="center" label="到达机场" min-width="130">
        <template slot-scope="scope">{{scope.row.dep}}-{{scope.row.arr}}</template>
      </el-table-column>
       <el-table-column fixed prop="flightNo" align="center" label="航班号" min-width="110"></el-table-column>
      <el-table-column fixed align="center" label="对标航班号"  min-width="110" >
        <template slot-scope="scope">{{timeFormat(scope.row.deptime)}}</template>
      </el-table-column>
      <el-table-column fixed prop="layout" align="center" label="比较项" min-width="110"></el-table-column>
      <el-table-column prop="price" align="center" label="比较方式" sortable min-width="110"></el-table-column>
      <el-table-column align="center" label="预警阈值" min-width="70">
         <template slot-scope="scope">
            <el-popover ref="popover3" placement="right" width="200" trigger="click" :content="stopnumData">
            <span slot="reference" style="color:#409EFF" @click="handleClick(scope.$index, scope.row)">{{ scope.row.stopover==true?'有':'无' }}</span>
          </el-popover>
          </template> 
      </el-table-column>
      <el-table-column prop="grabTime" align="center" label="通知微信号" min-width="150"></el-table-column>

      <el-table-column prop="lowestPriceChange" align="center" label="状态" min-width="110"></el-table-column>
     <el-table-column label="操作" min-width="140">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope)" type="primary" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope)" type="danger" size="small">删除</el-button>
          </template>
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
  <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改':'添加'">
      <el-form :model="role" label-width="90px" label-position="left">
        <el-form-item label="起飞机场">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
        <el-form-item label="到达机场">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="航班号">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="对标航班号">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="比较项">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="预警阈值">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="通知微信号">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="航班有效期">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
         <el-form-item label="状态">
          <el-input v-model="role.name" placeholder="" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
         <el-button type="primary" @click="confirmRole">保存</el-button>
         <el-button type="danger" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { LowestPrice  } from "@/api/ajax.js";
import { formatDate} from '@/utils/datefarmate'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { parseTime,deepClone } from "@/utils";
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      total: 0,
      time: [new Date(), new Date().setDate(new Date().getDate() + 15)],
      grabtime: [new Date(), new Date()],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        dep: "",
        arr: "",
        flightNO: ""
      },
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,

      tableData: null,
      stopnumData:''
    };
  },
  mounted() {
   // this.getList();
  },
  methods: {
    rowClass: function (row, index) {
      return { "height": "37px" }
    },
     cellClass: function (cell, index) {
      return { "padding": "0" }
    },
    dateFormat: function(flightDate) {
      if(flightDate==null){
        return null;
      }
      var t = new Date(flightDate); //row 表示一行数据, updateTime 表示要格式化的字段名称
      return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
    },

    timeFormat: function(column) {
      if(column==null){
        return null;
      }
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
    sortByDate(obj1, obj2){
      let val1 = obj1.flightDate
      let val2 = obj2.flightDate
      return val1 - val2
    },
    getTrade(){
      let temp=this.condition.dep;
      this.condition.dep=this.condition.arr;
      this.condition.arr=temp;
    },
    dataSearch(){
      debugger;
      var oneTime = new Date().setTime(new Date(this.time[0]).getTime());
      var twoTime = new Date().setTime(new Date(this.time[1]).getTime());
      if( oneTime + 3600 * 1000 * 24 * 31 < twoTime){
           this.$message({message: "时间间隔不能大于31天",type: "warning"});
      }
    },
    validate() {
      let reg1 = new RegExp("^[A-Z]{3}$");
      let reg2 = new RegExp("^[A-Z0-9]{6}$");
      if(!this.condition.dep && !this.condition.arr && !this.condition.flightNO){
         this.$message({message: "请输入始发城市或目的城市或填写航班号",type: "warning"});
          return false;
      }
      if (this.condition.dep) {
        if (!reg1.test(this.condition.dep.toUpperCase())) {
            this.$message({ message: "始发机场必须为三字符", type: "warning" });
          return false;
        }
        this.condition.dep.toUpperCase();
      }
      if (this.condition.arr) {
        if (!reg1.test(this.condition.arr.toUpperCase())) {
           this.$message({ message: "目的机场必须为三字符", type: "warning" });
          return false;
        }
        this.condition.arr.toUpperCase();
      }
      if (this.condition.flightNO) {
        if (this.condition.flightNO.indexOf(";") != -1) {
          let strs = this.condition.flightNO.split(";");
          if (strs.length > 6) {
               this.$message({ message: "最多只能航班号填六组航班号", type: "warning" });
            return false;
          } else {
            strs.forEach(item => {
              if (!reg2.test(item)) {
                this.$message({ message: "航班号必须为六位字符", type: "warning" });
                return false;
              }
            });
          }
        } else {
          if (!reg2.test(this.condition.flightNO)) {
             this.$message({ message: "航班号必须为六位字符", type: "warning" });
            return false;
          }
        }
        this.condition.flightNO;
      }
       if(this.time){
        var oneTime = new Date().setTime(new Date(this.time[0]).getTime());
        var twoTime = new Date().setTime(new Date(this.time[1]).getTime());
        if( oneTime + 3600 * 1000 * 24 * 31 < twoTime){
            this.$message({message: "时间间隔不能大于31天",type: "warning"});
            return false;
        }
      }
      return true;
    },
    handleClick(index,rows){
     let row = deepClone(rows);
      this.stopnumData='';
       if(row.stopnum==0)return;
       let parms={
         dep:row.dep,
         arr:row.arr,
         flightDate:row.flightDate,
         flightNo:row.flightNo
       }
      GetStopLeg(parms).then(response=>{
        debugger;
        if(response.status==200){
          this.stopnumData= response.data;
          this.visible=true;
        }
      }).catch(err => {
          console.log(err);
          this.visible=false;
          this.$message({ message: "获取经停数据失败", type: "error" });
      });
    },
    getList() {
      if (!this.validate()) {
        return;
      }
      debugger;
      this.listLoading = true;
      let t = this, o = t.condition;
      if (t.time && t.time.length) {
        o["flightDate"] = formatDate(t["time"][0], "yyyy-MM-dd");
        o["flightDateEnd"] = formatDate(t["time"][1], "yyyy-MM-dd");
      }
      if (t.grabtime && t.grabtime.length) {
        o["grabDateStart"] = formatDate(t["grabtime"][0], "yyyy-MM-dd")+" 00:00:00";
        o["grabDateEnd"] = formatDate(t["grabtime"][1], "yyyy-MM-dd")+" 23:59:59";
      }
      LowestPrice(o)
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
    handleAdd() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      // this.role = deepClone(scope.row)
      // this.$nextTick(() => {
      //   const routes = this.generateRoutes(this.role.routes)
      //   this.$refs.tree.setCheckedNodes(this.generateArr(routes))
      //   // set checked state of a node not affects its father and child nodes
      //   this.checkStrictly = false
      // })
    },
    handleDelete({ $index, row }) {
      this.$confirm('点击确认您将删除这条预警规则！', '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
  }
};
</script>
<style>
</style>


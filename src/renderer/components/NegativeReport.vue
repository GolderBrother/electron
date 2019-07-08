<template>
  <div id="report" class="content">
    <div class="main_top">
      <el-date-picker v-model="start_time" type="date" placeholder="选择日期"></el-date-picker>
      <span class="splitter">-</span>
      <el-date-picker v-model="end_time" type="date" placeholder="选择日期"></el-date-picker>

      <el-button type="primary" @click="searchData()">搜索</el-button>
    </div>
    <!-- 内容区域 -->

    <table class="electron-table">
      <tr>
        <th>标题/地址</th>
        <th width="100">舆情类型</th>
        <th width="100">舆情关键词</th>
        <th width="200">发现时间</th>
        <th width="200">帖子时间</th>
      </tr>
      <tr v-for="(item,key) in list" :key="key">
        <td align="left">
          <a :href="item.url" @click="openUrl($event, item.url)">{{item.title}}</a>
        </td>
        <td align="center">
          <!-- 1正面消息 -1负面消息 0中性 2不知道类型 -->

          <span v-if="item.type==1">正面消息</span>
          <span v-if="item.type==-1">负面消息</span>

          <span v-if="item.type==0">中性</span>

          <span v-if="item.type==2">未知类型</span>
        </td>
        <td align="center">{{item.keywords}}</td>

        <td align="center">{{item.add_time | formTime}}</td>
        <td align="center">{{item.update_time | formTime}}</td>
      </tr>
    </table>

    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
        :total="total"
      ></el-pagination>
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<script>
import tools from "../model/tools.js";
import * as StringUtils from "../utils/stringUtils";
export default {
  name: "report",
  data() {
    return {
      page: 1,

      start_time: "",

      end_time: "",
      list: [],
      total: 100,
      currentPage: 1
    };
  },
  filters: {
    formTime(value) {
      let date = new Date(value * 1000); //13位的时间戳
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = StringUtils.addZero(MM);
      let d = date.getDate();
      d = StringUtils.addZero(d);
      let h = date.getHours();
      h = StringUtils.addZero(h);
      let m = date.getMinutes();
      m = StringUtils.addZero(m);
      let s = date.getSeconds();
      s = StringUtils.addZero(s);
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  methods: {
    openUrl(e, url) {
      e.preventDefault();
      this.$electron.shell.openExternal(url);
    },
    pageChange(e) {
      console.log(e);

      this.page = e;
      this.currentPage = e;
      this.getReportData();
    },
    searchData() {
      this.page = 1;
      //  console.log(this.start_time);

      //  this.getReportData();

      /*
            let s_date=new Date(this.start_time);
            let e_date=new Date(this.end_time);

            this.start_time=s_date.getTime()/1000;
            this.end_time=e_date.getTime()/1000;
            */

      //重新请求数据

      this.currentPage = 1;
      this.getReportData();
    },
    getReportData() {
      let userinfo = tools.storage.get("userinfo");

      let sign = tools.sign({
        a: "logList",
        uid: userinfo.id,
        salt: userinfo.salt
      });

      let api = `${tools.config.apiUrl}index.php?m=Api&a=logList`;

      //格式化日期
      let s_date = new Date(this.start_time);
      let e_date = new Date(this.end_time);

      let start_time = this.start_time ? s_date.getTime() / 1000 : "";

      let end_time = this.end_time ? e_date.getTime() / 1000 : "";

      this.$http
        .get(api, {
          params: {
            uid: userinfo.id,
            sign: sign,
            p: this.page,
            start_time: start_time,
            end_time: end_time,
            type: -1
          }
        })
        .then(response => {
          console.log(response);
          this.list = response.data.result;
          this.total = response.data.totalPage * 10;
        })
        .catch(error => {
          this.$openMessage({
            message: error,
            type: "warning"
          });
        });
    }
  },
  mounted() {
    //获取get传值

    console.log(this.$route.query);

    this.getReportData();
  }
};
</script>

<style lang="scss">
.splitter {
  margin: 0 10px;
}
</style>

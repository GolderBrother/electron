<template>
  <div id="home" class="content">
    <highcharts :options="areaOptions" ref="areaOptions"></highcharts>
    <highcharts :options="columnOption" ref="columnOption"></highcharts>

    <!-- 登录页面 -->
    <el-dialog
      title="登录"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :center="true"
      :visible.sync="dialogFormVisible"
    >
      <el-form>
        <el-form-item>
          <el-input v-model="userinfo.username" @keyup.enter.native="doLogin" placeholder="用户名：admin"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userinfo.password" type="password" @keyup.enter.native="doLogin" placeholder="密码：123456"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="width:80%" type="primary" @click="doLogin()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let areaOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
    backgroundColor: "#eeeeee"
  },
  credits: {
    enabled: false // 禁用版权信息
  },
  title: {
    text: "舆情关键词数量分布图"
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.y}</b>"
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y}"
        // style: {
        // 		color: (this.$Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
        // }
      }
    }
  },
  series: []
};

//柱状图
let columnOption = {
  chart: {
    type: "column"
  },
  title: {
    text: "舆情数量统计"
  },
  credits: {
    enabled: false // 禁用版权信息
  },
  subtitle: {
    text: "数据来源: blog.poetries.top"
  },
  xAxis: {
    categories: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: "舆情数量"
    }
  },
  tooltip: {
    // head + 每个 point + footer 拼接成完整的 table
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true
  },
  plotOptions: {
    column: {
      borderWidth: 0
    }
  },
  series: []
};

//引入tools模块
import tools from "../model/tools.js";

// console.log(tools);
export default {
  name: "home",

  data() {
    return {
      areaOptions: areaOptions,
      columnOption: columnOption,
      dialogFormVisible: false,
      userinfo: {}
    };
  },
  //刚加载页面的时候
  beforeMount() {
    //判断用户有没有登录
	let userinfo = tools.storage.get("userinfo");
    this.dialogFormVisible = userinfo ? false : true;
  },
  mounted() {
    this.getAreaSeries();
    this.getColumnSeries();
  },
  methods: {
    // 获取区域数据
    getAreaSeries() {
      let userinfo = tools.storage.get("userinfo");
      let sign = tools.sign({
        a: "areaOptions",
        uid: userinfo.id,
        salt: userinfo.salt //私钥
      });
      //   let api =
      //     tools.config.apiUrl +
      //     "index.php?m=Api&a=areaOptions&uid=" +
      //     userinfo.id +
      //     "&sign=" +
      //     sign;
      let api = `${tools.config.apiUrl}index.php?m=Api&a=areaOptions&uid=${userinfo.id}&sign=${sign}`;
      this.$http
        .get(api)
        .then(response => {
          console.log(response.data.result);

          //把服务器的数据格式转换成本地
          let areaData = response.data.result;
          let areaDataArray = [];
          for (let i = 0; i < areaData.length; i++) {
            areaDataArray.push({
              name: areaData[i].name,
              y: parseInt(areaData[i].count)
            });
          }
          //增加数据
          // console.log(areaDataArray);

          let areaOptionsChart = this.$refs.areaOptions.chart;
          areaOptionsChart.addSeries({
            name: "分布比例",
            colorByPoint: true,
            data: areaDataArray
          });
        })
        .catch(error => {
          this.$openMessage({
            message: error,
            type: "warning"
          });
        });
    },

    // 获取列数据
    getColumnSeries() {
      let userinfo = tools.storage.get("userinfo");
      let sign = tools.sign({
        a: "columnOptions",
        uid: userinfo.id,
        salt: userinfo.salt //私钥
      });
      //   let api =
      //     tools.config.apiUrl +
      //     "index.php?m=Api&a=columnOptions&uid=" +
      //     userinfo.id +
      //     "&sign=" +
      //     sign;
      let api = `${tools.config.apiUrl}index.php?m=Api&a=columnOptions&uid=${userinfo.id}&sign=${sign}`;
      this.$http
        .get(api)
        .then(response => {
          console.log(response.data.result);
          let columnOptionChart = this.$refs.columnOption.chart;
          for (let i = 0; i < response.data.result.length; i++) {
            columnOptionChart.addSeries({
              name: response.data.result[i].name,
              data: response.data.result[i].data
            });
          }
        })
        .catch(error => {
          this.$openMessage({
            message: error,
            type: "warning"
          });
        });
    },
    doLogin() {
      //获取用户名密码
      //console.log(this.userinfo.username);
      //请求api接口实现登录

      // 实际地址：http://www.apiying.com/yuqing/index.php?m=Api&a=log

      if (this.userinfo.username && this.userinfo.password) {
        this.$http
          .post(`${tools.config.apiUrl}index.php?m=Api&a=login`, {
            username: this.userinfo.username,
            password: this.userinfo.password
          })
          .then(response => {
            // console.log(response);
            response = response.data;
            if (response.success) {
              //保存用户信息

              tools.storage.set("userinfo", response.result);

              this.dialogFormVisible = false;
              this.getAreaSeries();
              this.getColumnSeries();
            } else {
              this.$openMessage({
                message: response.message,
                type: "warning"
              });
            }
          })
          .catch(error => {
            this.$openMessage({
              message: response.message,
              type: "warning"
            });
          });
      } else {
        this.$openMessage({
          message: "用户名密码不能为空",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="scss">
</style>

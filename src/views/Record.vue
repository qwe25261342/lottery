<template>
  <div class="container">
    <div class="contant">
      <nav>
        <ul>
          <li><a href="/">註冊</a></li>
          <li><a href="/lottery">彩票</a></li>
          <li><a href="/record">購買紀錄</a></li>
          <div class="userbox">
            <li>會員:{{ nickname }}</li>
            <li>剩餘點數:{{ balance }}</li>
          </div>
        </ul>
      </nav>
      <div onload="ShowTime">
        <h2>{{ nowDay }} {{ nowTime }}</h2>
      </div>
      <h2>購買紀錄</h2>
      <table class="record_table" border="2">
        <tr>
          <th>期</th>
          <th>第1球</th>
          <th>第2球</th>
          <th>第3球</th>
          <th>第4球</th>
          <th>第5球</th>
          <th>開獎</th>
          <th>中獎金額</th>
        </tr>
        <tr v-for="item in record" :key="item.id">
          <td>{{ item.issue }}</td>
          <td>{{ item.settle_n1 }}</td>
          <td>{{ item.settle_n2 }}</td>
          <td>{{ item.settle_n3 }}</td>
          <td>{{ item.settle_n4 }}</td>
          <td>{{ item.settle_n5 }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.gain_amount }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../router/url";
const appApi = url.api;
export default {
  data() {
    return {
      nowDay: "",
      nowTime: "",
      record: [],
      nickname: "",
      balance: "",
    };
  },
  methods: {
    // 得到當下時間
    timeFormate(timeStamp) {
      let newdate = new Date(timeStamp);

      let year = newdate.getFullYear();
      let month =
        newdate.getMonth() + 1 < 10
          ? "0" + (newdate.getMonth() + 1)
          : newdate.getMonth() + 1;
      let date =
        newdate.getDate() < 10 ? "0" + newdate.getDate() : newdate.getDate();
      let hh =
        newdate.getHours() < 10 ? "0" + newdate.getHours() : newdate.getHours();
      let mm =
        newdate.getMinutes() < 10
          ? "0" + newdate.getMinutes()
          : newdate.getMinutes();
      let ss =
        newdate.getSeconds() < 10
          ? "0" + newdate.getSeconds()
          : newdate.getSeconds();

      this.nowTime = hh + ":" + mm + ":" + ss;
      this.nowDay = year + "年" + month + "月" + date + "日";
    },
    // 定時器函數
    nowTimes() {
      let self = this;
      self.timeFormate(new Date());
      setInterval(function () {
        self.timeFormate(new Date());
      }, 1000);
    },
  },
  // 創建完成時
  created() {
    this.nowTimes();
  },
  // 掛載完成時
  mounted() {
    this.nowTimes();

    const  token =  localStorage.getItem("token");
    //取得歷史紀錄
    axios.post(appApi + "/token/history", { token }).then((res) => {
      if (res.data.success == false) {
        this.$router.push({ name: "Login" });
        alert("請登入");
        return
      }
      this.record = res.data;
    });
    //取得會員資料
    axios.post(appApi + "/token/getuser", { token }).then((res) => {
      if (res.data.success == false) {
        this.$router.push({ name: "Login" });
        return
      }
      this.nickname = res.data[0].nickname;
      this.balance = res.data[0].balance;
    });
  },
};
</script>
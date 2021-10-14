<template>
  <div class="container">
    <div class="contant">
      <nav>
        <ul>
          <li><a href="/">註冊</a></li>
          <li><a href="/lottery">彩票</a></li>
          <li><a href="/record">購買紀錄</a></li>
          <li><a href="/singout" @click="signout">登出</a></li>
          <div class="userbox">
            <li>會員:{{ nickname }}</li>
            <li>剩餘點數:{{ balance }}</li>
          </div>
        </ul>
      </nav>
      <div onload="ShowTime">
        <h3>{{ nowDay }}</h3>
        <h3>{{ nowTime }}</h3>
        <h1>本期 : {{ issue }}</h1>
      </div>
      <el-form>
        <div class="row mb-3">
          <div class="col">
            <el-input
              v-model="ball[0].value"
              v-on:input="max"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball[1].value"
              v-on:input="max"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball[2].value"
              v-on:input="max"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball[3].value"
              v-on:input="max"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball[4].value"
              v-on:input="max"
              type="number"
              class="form-control"
            />
          </div>
          <button
            v-if="closeing"
            type="submit"
            class="btn btn-primary"
            disabled
          >
            關盤中
          </button>
          <button v-else type="submit" class="btn btn-primary" @click="send">
            購買
          </button>
        </div>
      </el-form>
      <div class="lottery_record">
        <h2>開獎紀錄</h2>
        <div
          style="overflow-y: auto; overflow-x: auto; width: auto; height: 500px"
        >
          <table class="table table-striped" border="2">
            <tr>
              <th>期</th>
              <th>第1球</th>
              <th>第2球</th>
              <th>第3球</th>
              <th>第4球</th>
              <th>第5球</th>
            </tr>
            <tr v-for="item in ball" :key="item.issue">
              <td>{{ item.issue }}</td>
              <td>{{ item.n1 }}</td>
              <td>{{ item.n2 }}</td>
              <td>{{ item.n3 }}</td>
              <td>{{ item.n4 }}</td>
              <td>{{ item.n5 }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../router/url";
import io from "socket.io-client";
const appApi = url.api;
var socket = io(appApi);
export default {
  data() {
    return {
      nowDay: "",
      nowTime: "",
      ball: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      nickname: "",
      balance: "",
      issue: "",
      closeing: false,
    };
  },
  methods: {
    send() {
      const n1 = this.ball[0].value;
      const n2 = this.ball[1].value;
      const n3 = this.ball[2].value;
      const n4 = this.ball[3].value;
      const n5 = this.ball[4].value;
      const token = localStorage.getItem("token");
      const params = { n1, n2, n3, n4, n5 };
      axios.post(appApi + "/token/setball", { params, token }).then((res) => {
        console.log(res.data);
        if (res.data.success == false) {
          this.$router.push({ name: "Login" });
          return;
        }
        if (res.data.number == false || res.data.repeat || res.data.over) {
          alert("購買失敗");
          return;
        }
        if (res.data.closing) {
          alert("關盤中");
          return;
        }
        if (res.data.money == false) {
          alert("請儲值");
          return;
        } else {
          alert("購買成功");
        }
      });
    },
    // 得到當下時間
    timeFormate(timeStamp) {
      let newdate = new Date(timeStamp);
      let year = newdate.getFullYear();
      let month = newdate.getMonth() + 1 < 10 ? "0" + (newdate.getMonth() + 1) : newdate.getMonth() + 1;
      let date = newdate.getDate() < 10 ? "0" + newdate.getDate() : newdate.getDate();
      let hh = newdate.getHours() < 10 ? "0" + newdate.getHours() : newdate.getHours();
      let mm = newdate.getMinutes() < 10 ? "0" + newdate.getMinutes() : newdate.getMinutes();
      let ss = newdate.getSeconds() < 10 ? "0" + newdate.getSeconds() : newdate.getSeconds();
      this.nowTime = hh + ":" + mm + ":" + ss;
      this.nowDay = year + "年" + month + "月" + date + "日";
      if (mm == 9 || mm == 19 || mm == 29 || mm == 39 || mm == 49 || mm == 59) {
        this.closeing = true;
      }else{
        this.closeing = false;
      }
    },
    // 定時器函數
    nowTimes() {
      let self = this;
      self.timeFormate(new Date());
      setInterval(function () {
        self.timeFormate(new Date());
      }, 1000);
    },
    //限制輸入框最大與最小值
    max() {
      for (let i = 0; i < 5; i++) {
        let value = this.ball[i].value;

        if (value < 0) {
          console.log(value);
          alert("最小1");
          this.ball[i].value = "";
        }
        if (value > 30) {
          alert("最大30");
          this.ball[i].value = "";
        }
      }
    },
    //登出
    signout() {
      const params = {
        token: localStorage.getItem("token"),
      };
      localStorage.clear();
      axios.post(appApi + "/singout", { params });
    },
  },

  // 創建完成時
  created() {
    this.nowTimes();
    //取得本期期數
    axios.post(appApi + "/thisIssue").then((res) => {
      this.issue = res.data[0].issue;
    });
    //取得已開獎紀錄
    axios.post(appApi + "/status").then((res) => {
      this.ball = res.data;
    });
  },
  // 掛載完成時
  mounted() {
    this.nowTimes();
    const token = localStorage.getItem("token");

    //取得會員資料
    axios.post(appApi + "/token/getuser", { token }).then((res) => {
      console.log(res.data);
      if (res.data.success == false) {
        this.$router.push({ name: "Login" });
        alert("請登入");
        return;
      }
      this.nickname = res.data[0].nickname;
      this.balance = res.data[0].balance;
    });

    //更新已開獎紀錄
    socket.on("receive-openBall", () => {
      axios.post(appApi + "/status").then((res) => {
        this.ball = res.data;
      });
    });

    //更新本期期數
    socket.on("receive-issue", () => {
      axios.post(appApi + "/thisIssue").then((res) => {
        this.issue = res.data[0].issue;
      });
    });
  },
};
</script>
<style>
.record_table {
  width: 100%;
}
.col .el-input {
  display: contents;
}
tr:nth-child(odd) {
  background-color: #ccc;
}
</style>
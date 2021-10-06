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
        <h1>{{ nowDay }}</h1>
        <h1>{{ nowTime }}</h1>
      </div>
      <el-form>
        <div class="row mb-3">
          <div class="col">
            <el-input
              v-model="ball.n1"
              type="number"
              class="form-control"
            />
              <!-- max="30"
              min="1"
             @input="numberChange(arguments[0], 30)" -->
          </div>
          <div class="col">
            <el-input
              v-model="ball.n2"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball.n3"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball.n4"
              type="number"
              class="form-control"
            />
          </div>
          <div class="col">
            <el-input
              v-model="ball.n5"
              type="number"
              class="form-control"
            />
          </div>
          <button type="submit" class="btn btn-primary" @click="send">
            購買
          </button>
        </div>
      </el-form>

      <div class="lottery_record">
        <h2>開獎紀錄</h2>

        <table class="record_table" border="2">
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
      ball: [],
      nickname: "",
      balance: "",
    };
  },
  methods: {
    send() {
      const { n1,n2,n3,n4,n5 } = this.ball
      const params = { n1,n2,n3,n4,n5, token: localStorage.getItem("token"), }

      if(params == ""){
        return;
      }
      axios
      .post( appApi + "/setball" ,{params})
      .then((res) =>{
        console.log(res);
      })
    },

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
    //
    // numberChange(val, maxNum) {
    //   this.ball.n1 = Number(val);
    //   this.$nextTick(() => {
    //     let num = Math.min(Number(val), maxNum);
    //     if (num < 0) {
    //       this.ball.n1 = 0;
    //     } else {
    //       this.ball.n1 = num;
    //     }
    //   });
    // },
  },

  // 創建完成時
  created() {
    this.nowTimes();
  },
  // 掛載完成時
  mounted() {
    this.nowTimes();
    let params = {
      token: localStorage.getItem("token"),
    };

    //取得會員資料
    axios.post(appApi + "/getuser", { params }).then((res) => {
      //console.log(res.data);
      this.nickname = res.data[0].nickname;
      this.balance = res.data[0].balance;
    });
    axios.post(appApi + "/status" ).then((res) => {
      this.ball =res.data
      console.log(this.ball);
    });
  },
};
</script>
<style>
.record_table {
  width: 100%;
}
.col .el-input{
  display: contents;
}
</style>
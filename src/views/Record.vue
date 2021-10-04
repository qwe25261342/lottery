<template>
  <div class="container">
    <div class="contant">
      <nav>
        <ul>
          <li><a href="/">註冊</a></li>
          <li><a href="/lottery">彩票</a></li>
          <li><a href="/record">購買紀錄</a></li>
          <div class="userbox">
              <li>會員</li>
            <li>剩餘點數:</li>
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
        <tr>
          <td>N</td>
          <td>cell 2</td>
          <td>cell 2</td>
          <td>cell 2</td>
          <td>cell 2</td>
          <td>cell 2</td>
          <td>0</td>
          <td>0</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nowDay: "",
      nowTime: "",
      ball: {
        n1: "",
        n2: "",
        n3: "",
        n4: "",
        n5: "",
      },
    };
  },
  methods: {
    send() {
      // const { n1,n2,n3,n4,n5 } = this.ball
      // const settle = { n1,n2,n3,n4,n5 }
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
  },
  // 創建完成時
  created() {
    this.nowTimes();
  },
  // 掛載完成時
  mounted() {
    this.nowTimes();
  },
};
</script>
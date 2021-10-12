<template>
  <div  class="container">
    <div class="contant">
      <nav>
        <ul>
          <li><a href="/">註冊</a></li>
          <li><a href="/lottery">彩票</a></li>
          <li><a href="/record">購買紀錄</a></li>
        </ul>
      </nav>
      <div class="login-container">
        <div class="card"  ref="loginForm">
          <div class="card-header">登入頁面</div>
          <div class="card-body">
            <form ref="loginForm">
              <div class="form-group">
                <label for="name">使用者名稱</label>
                <input
                  v-model="loginForm.account"
                  id="name"
                  type="text"
                  class="form-control"
                  name="name"
                />
              </div>
              <div class="form-group">
                <label for="password">密碼</label>
                <input
                  v-model="loginForm.password"
                  id="password"
                  type="password"
                  class="form-control"
                  name="password"
                />
              </div>
              <button
                type="primary"
                class="btn btn-primary"
                @click.prevent="loginUser"
              >
                登入
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../router/url"
const appApi = url.api

export default {
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
      },
    };
  },

  methods: {
   loginUser() {
      let params = {
        account: this.loginForm.account,
        password: this.loginForm.password,
        token: localStorage.getItem("token"),
      };
      axios
        .get( appApi +  "/login", { params })
        .then((res) => {
          if (res.data.success) {
            var token = res.data.token;
            //儲存Token到localStorage
            localStorage.setItem("token", token);
            token = JSON.stringify(token);
            this.$router.push(location.replace("/lottery"));
          } else {
            this.loginForm.account = "";
            this.loginForm.password = "";
            alert("帳號密碼輸入錯誤");
            console.log(res);
          }
        });
    },
  },
};
</script>

<style>
nav {
  background-color: #567c3d;
  color: #fff;
  padding: 30px 60px 15px 60px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
}

nav ul {
  display: flex;
}

nav li {
  list-style: none;
}

nav li a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 8px;
}
nav li a:hover {
  color: orange;
  text-decoration: none;
}

</style>


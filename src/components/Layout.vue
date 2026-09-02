<template>
  <el-container>
    <el-header class="header">
      <el-menu
        :default-active="active"
        background-color="#ffffff"
        text-color="#303133"
        active-text-color="#303133"
        :router="true"
        class="header-menu"
        mode="horizontal"
      >
        <el-menu-item class="logo-menu-item" index="/">
          <img class="icon" src="../assets/sco-icon.png" alt="Cafe Portal Icon" />
        </el-menu-item>

        <div class="right-menu-group">
          <el-menu-item index="/">介绍</el-menu-item>
          <el-menu-item index="/remote-analysis">遥感影像分析</el-menu-item>
          <el-menu-item index="/search">气候数据分析</el-menu-item>

          <el-menu-item index="/tasks" v-if="!!userInfo">我的任务</el-menu-item>
          <el-submenu index="user-menu" v-if="!!userInfo">
            <template slot="title">{{ userInfo.userName }}</template>
            <el-menu-item index="change_password" @click="handleChangePassword">修改密码</el-menu-item>
            <el-menu-item index="logout" @click="handleLogout">退出登录</el-menu-item>
          </el-submenu>

          <el-menu-item index="/login" v-if="!userInfo">登录</el-menu-item>
        </div>
      </el-menu>
    </el-header>
    <el-container class="container">
      <slot></slot>
    </el-container>
  </el-container>
</template>

<script>
// The script section has the necessary logic for userInfo
import { userContext } from '../contexts'
import { cafeClient } from '../clients'

export default {
  name: 'Layout',
  mounted() {
    userContext.$on('change:userInfo', userInfo => {
      this.userInfo = userInfo
    })
    this.userInfo = userContext.userInfo
    this.$router.afterEach(to => {
      this.active = to.path
    })
  },
  data() {
    return {
      active: this.$route.path,
      userInfo: userContext.userInfo,
    }
  },
  methods: {
    handleChangePassword() {
      // Add logic for changing password here
    },
    handleLogout() {
      cafeClient.logout().then(() => {
        userContext.setUserInfo(null)
        this.$message.success('logout success!')
        this.$router.replace({ path: '/' })
      })
    },
  },
}
</script>

<style scoped>
/* Main header and menu styling */
.header {
  padding: 0 5%;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}
.header-menu {
  border-bottom: none !important;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo styling */
.logo-menu-item {
  padding: 0 !important;
}
.icon {
  height: 50px;
  width: auto;
}

/* Container for right-side links */
.right-menu-group {
  display: flex;
  align-items: center;
}

/* Styling for individual menu items */
.right-menu-group .el-menu-item,
.right-menu-group .el-submenu {
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 16px;
  font-weight: 500;
}

/* Active menu item styling */
.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #f5c142;
  color: #303133 !important;
}

/* Container for page content */
.container {
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 60px; /* Height of the header */
}
</style>
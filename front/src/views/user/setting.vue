<template>
  <div class="user-setting">
    <basic-container>
      <el-tabs tab-position="left"
               stretch
               style="height: 400px;">
        <el-tab-pane label="安全设置">
          <div class="user-setting__main">
            <div class="user-setting__title">安全设置</div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-user"></i>
                  账号安全
                </p>
                <p class="subtitle">更改当前账号密码</p>
              </div>
              <div class="user-setting__menu">
                <el-button size="small">修改</el-button>
              </div>
            </div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-mobile-phone"></i>
                  绑定手机
                </p>
                <p class="subtitle">设置您的绑定手机号码</p>
              </div>
              <div class="user-setting__menu">
                <el-button size="small">修改</el-button>
              </div>
            </div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-message"></i>
                  绑定邮箱
                </p>
                <p class="subtitle">设置您的绑定邮箱</p>
              </div>
              <div class="user-setting__menu">
                <el-button size="small">修改</el-button>
              </div>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="通知设置">
          <div class="user-setting__main">
            <div class="user-setting__title">通知设置</div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-document"></i>
                  系统消息
                </p>
                <p class="subtitle">系统性的通知或者更新消息</p>
              </div>
              <div class="user-setting__menu">
                <el-switch v-model="value">
                </el-switch>
              </div>
            </div>
            <div class="user-setting__item">
              <div class="user-setting__meta">
                <p class="title">
                  <i class="el-icon-user"></i>
                  帐号消息
                </p>
                <p class="subtitle">帐号变更的通知消息</p>
              </div>
              <div class="user-setting__menu">
                <el-switch v-model="value">
                </el-switch>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: true,
    }
  }
}
</script>

<style lang="scss">
.user-setting {
  &__main {
    padding: 8px 40px;
  }
  &__item {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  &__title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  &__meta {
    flex: 1;
    .title {
      margin: 6px 0;
      font-weight: 700;
      font-size: 14px;
    }
    .subtitle {
      margin: 8px 0;
      font-size: 14px;
      color: #555;
    }
  }
}
</style>

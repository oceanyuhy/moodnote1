Page({
  data: {
    disabled: false
  },

  // 账号密码登录
  login() {
    wx.setStorageSync('userInfo', {
      account: 'test123',
      nickname: '测试用户'
    });
    wx.showToast({ title: '登录成功' });
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' });
    }, 1000);
  },

  // 去注册
  goRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  },

  // =============================
  // ✅ 2025 最新官方获取头像昵称
  // =============================
  onChooseAvatar(e) {
    // 获取头像
    const avatarUrl = e.detail.avatarUrl;

    // 必须调用 wx.login 获取 openid
    wx.login({
      success: (res) => {
        wx.cloud.callFunction({
          name: 'login',
          success: (cloudRes) => {
            const openid = cloudRes.result.openid;
            const db = wx.cloud.database();

            // 构建用户信息
            const userData = {
              openid,
              avatar: avatarUrl,
              nickname: "微信用户", // 新版本不能直接拿昵称，可让用户补充
              createTime: db.serverDate()
            };

            // 保存到本地
            wx.setStorageSync('userInfo', {
              account: openid,
              avatar: avatarUrl,
              nickname: "微信用户"
            });

            // 保存到数据库
            db.collection('users').where({ openid }).get().then(ret => {
              if (ret.data.length === 0) {
                db.collection('users').add({ data: userData });
              } else {
                db.collection('users').doc(ret.data[0]._id).update({
                  data: { avatar: avatarUrl }
                });
              }
            });

            wx.showToast({ title: '登录成功' });
            setTimeout(() => {
              wx.switchTab({ url: '/pages/index/index' });
            }, 1000);
          }
        });
      }
    });
  }
});
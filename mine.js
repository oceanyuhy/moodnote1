const util = require('../../utils/util.js');

Page({
  data: {
    showSheet: false,
    avatar: '/images/default-avatar.png',
    nickname: '微信用户'
  },

  onShow() {
    util.checkLogin();
    this.getUserInfo();
  },

  // 获取用户信息
  getUserInfo() {
    let user = wx.getStorageSync('userInfo');
    if (user) {
      this.setData({
        avatar: user.avatar || '/images/default-avatar.png',
        nickname: user.nickname || '微信用户'
      });
    }
  },

  // ========= 进入个人资料（修复版！！！） =========
  goProfile() {
    // 只判断是否有 userInfo，不判断 openid
    let user = wx.getStorageSync('userInfo');
    if (!user) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    // 能走到这里，一定能跳页面！
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  // ========= 底部弹出层 =========
  showActionSheet() {
    this.setData({ showSheet: true });
  },
  hideSheet() {
    this.setData({ showSheet: false });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '已退出登录' });
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/login/login' });
          }, 1000);
        }
      }
    })
    this.hideSheet();
  },

  // 注销账户
  deleteAccount() {
    wx.showModal({
      title: '警告',
      content: '注销后账户数据将全部清空，无法恢复！确定继续吗？',
      confirmText: '确定注销',
      confirmColor: '#ff3333',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '账户已注销', icon: 'error' });
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/login/login' });
          }, 1500);
        }
      }
    })
    this.hideSheet();
  }
});
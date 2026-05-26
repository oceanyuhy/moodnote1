App({
  onLaunch() {
    // 云开发初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云开发')
    } else {
      wx.cloud.init({
        env: 'cloud1-d4gj5k1n0aba5df03', // 后面教你怎么填
        traceUser: true
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
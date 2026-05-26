// 登录校验工具
function checkLogin() {
  let userInfo = wx.getStorageSync('userInfo');
  if (!userInfo || !userInfo.account) {
    wx.navigateTo({
      url: '/pages/login/login',
    });
    return false;
  }
  return true;
}

module.exports = {
  checkLogin: checkLogin
}
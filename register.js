Page({
  goBack() {
    wx.navigateBack()
  },

  wxLogin() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        const userInfo = res.userInfo;
        wx.cloud.callFunction({
          name: 'login',
          success: cloudRes => {
            const openid = cloudRes.result.openid;
            const db = wx.cloud.database();
            db.collection('users').where({ openid }).get().then(listRes => {
              let userData = {
                openid,
                nickname: userInfo.nickName,
                avatar: userInfo.avatarUrl,
                gender: userInfo.gender,
                createTime: db.serverDate()
              };
              if(listRes.data.length === 0){
                db.collection('users').add({ data: userData });
              }else{
                db.collection('users').doc(listRes.data[0]._id).update({
                  data: {
                    nickname: userInfo.nickName,
                    avatar: userInfo.avatarUrl
                  }
                });
              }
              wx.setStorageSync('userInfo',{
                account: openid,
                nickname: userInfo.nickName,
                avatar: userInfo.avatarUrl
              });
              wx.showToast({ title: '微信登录成功' });
              setTimeout(()=>{
                wx.switchTab({ url: '/pages/index/index' });
              },1000);
            })
          }
        })
      },
      fail: () => {
        wx.showToast({ title: '授权取消', icon: 'none' });
      }
    })
  }
});
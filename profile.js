const db = wx.cloud.database();

Page({
  data: {
    avatar: "/images/default-avatar.png",
    nickname: "微信用户",
    gender: "男",
    region: "未知",
    lastChangeNicknameTime: 0,
  },

  onLoad() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    let user = wx.getStorageSync("userInfo");
    if (!user) {
      wx.showToast({ title: "获取资料失败", icon: "none" });
      return;
    }

    this.setData({
      avatar: user.avatar || "/images/default-avatar.png",
      nickname: user.nickname || "微信用户",
      gender: user.gender || "男",
      region: user.region || "未知",
      lastChangeNicknameTime: user.lastChangeNicknameTime || 0,
    });
  },

  changeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      success: (res) => {
        let path = res.tempFiles[0].tempFilePath;
        wx.showLoading();
        wx.cloud.uploadFile({
          cloudPath: "avatar/" + Date.now() + ".png",
          filePath: path,
          success: (up) => {
            this.setData({ avatar: up.fileID });
            this.updateUser({ avatar: up.fileID });
            wx.hideLoading();
          },
          fail: () => wx.hideLoading()
        });
      }
    });
  },

  editNickname() {
    let now = Date.now();
    let last = this.data.lastChangeNicknameTime;
    let oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (last && now - last < oneMonth) {
      wx.showToast({ title: "每月只能修改一次昵称", icon: "none" });
      return;
    }

    wx.showModal({
      title: "修改昵称",
      editable: true,
      placeholderText: "请输入新昵称",
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({ nickname: res.content });
          this.updateUser({
            nickname: res.content,
            lastChangeNicknameTime: now
          });
        }
      }
    });
  },

  editGender() {
    wx.showActionSheet({
      itemList: ["男", "女"],
      success: (res) => {
        let gender = res.tapIndex === 0 ? "男" : "女";
        this.setData({ gender });
        this.updateUser({ gender });
      }
    });
  },

  editRegion() {
    wx.chooseAddress({
      success: (res) => {
        let region = res.provinceName + " " + res.cityName;
        this.setData({ region });
        this.updateUser({ region });
      }
    });
  },

  updateUser(data) {
    let user = wx.getStorageSync("userInfo");
    if (!user) return;

    let newUser = { ...user, ...data };
    wx.setStorageSync("userInfo", newUser);
  },
});
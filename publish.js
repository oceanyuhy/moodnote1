const util = require('../../utils/util.js');
const db = wx.cloud.database();

Page({
  data: {
    content: '',
    imgList: []
  },

  onLoad(options) {
    util.checkLogin();
    if (options.imgs) {
      this.setData({ imgList: JSON.parse(options.imgs) });
    }
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  goBack() {
    wx.navigateBack();
  },

  addImg() {
    let remain = 9 - this.data.imgList.length;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      success: res => {
        let newImgs = res.tempFiles.map(i => i.tempFilePath);
        this.setData({ imgList: this.data.imgList.concat(newImgs) });
      }
    });
  },

  delImg(e) {
    let list = this.data.imgList;
    list.splice(e.currentTarget.dataset.index, 1);
    this.setData({ imgList: list });
  },

  async doPublish() {
    let { content, imgList } = this.data;
    if (!content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '发布中...' });

    // ======================
    // 🔥 修复：获取当前登录的微信头像、昵称
    // ======================
    const userInfo = wx.getStorageSync('userInfo') || {};
    const userAvatar = userInfo.avatar || "/images/default-avatar.png";
    const userNickname = userInfo.nickname || "微信用户";

    let picUrls = [];
    for (let p of imgList) {
      let up = await wx.cloud.uploadFile({
        cloudPath: 'note/' + Date.now() + Math.random() + '.png',
        filePath: p
      });
      picUrls.push(up.fileID);
    }

    const now = Date.now();
    db.collection('notes').add({
      data: {
        content,
        picUrls,
        createAt: now,
        expireTime: now + 24 * 60 * 60 * 1000,
        likes: 0,
        comments: 0,
        // ======================
        // 🔥 修复：存入头像、昵称
        // ======================
        avatar: userAvatar,
        nickname: userNickname
      },
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '发布成功' });
        setTimeout(() => wx.navigateBack(), 1500);
      },
      fail: () => wx.hideLoading()
    });
  },

  noDev() {
    wx.showToast({ title: '开发中...', icon: 'none' });
  }
});
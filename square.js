const util = require('../../utils/util.js');
const db = wx.cloud.database();

Page({
  data: {
    noteList: []
  },

  onShow() {
    util.checkLogin();
    this.getNotes();
  },

  onPullDownRefresh() {
    this.getNotes();
  },

  getNotes() {
    const now = Date.now();
    db.collection('notes')
      .where({
        expireTime: db.command.gt(now)
      })
      .orderBy('createAt', 'desc')
      .get()
      .then(res => {
        this.setData({ noteList: res.data });
        wx.stopPullDownRefresh();
      })
      .catch(() => {
        wx.stopPullDownRefresh();
      });
  },

  goPublish() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      success: res => {
        const paths = res.tempFiles.map(item => item.tempFilePath);
        wx.navigateTo({
          url: '/pages/publish/publish?imgs=' + JSON.stringify(paths)
        });
      }
    });
  }
});
const util = require('../../utils/util.js');

Page({
  onShow() {
    util.checkLogin();
  }
});
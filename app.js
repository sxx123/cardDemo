//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'dev-dp8qa'
    })
  },
})
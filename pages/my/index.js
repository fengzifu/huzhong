const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0
  },
  onLoad() {

  },
  onShow() {
    this.getUserInfo();
    this.setData({
      version: app.globalData.version
    });
    this.getUserApiInfo();
    this.getUserAmount();
    this.checkScoreSign();
  },
  getUserInfo: function(cb) {
    var that = this
    wx.login({
      success: function() {
        wx.getUserInfo({
          success: function(res) {
            that.setData({
              userInfo: res.userInfo
            });
          }
        })
      }
    })
  },

  getUserApiInfo: function() {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            userMobile: res.data.data.base.mobile
          });
        }
      }
    })

  },
  getUserAmount: function() {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })

  },
  checkScoreSign: function() {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/today-signed',
      data: {
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            score_sign_continuous: res.data.data.continuous
          });
        }
      }
    })
  },
  scoresign: function() {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/sign',
      data: {
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  toPersonalDynamics: function() {
    wx.navigateTo({
      url: '/pages/personal_dynamics/index'
    })
  },
  toAllAuction: function() {
    wx.navigateTo({
      url: '/pages/all_auction/index'
    })
  },
  toAuction: function() {
    wx.navigateTo({
      url: '/pages/auction/index'
    })
  },
  toWinningRecord: function() {
    wx.navigateTo({
      url: '/pages/winning_record/index'
    })
  },
  toMarginManagement: function() {
    wx.navigateTo({
      url: '/pages/margin_management/index'
    })
  },

  toQuestion: function() {
    wx.navigateTo({
      url: '/pages/question/index'
    })
  },
  toContact: function() {
    wx.navigateTo({
      url: '/pages/contact/index'
    })
  }

})
//index.js
//获取应用实例
const app = getApp()
let store = require("../../utils/store.js")
let router = require("../../utils/router.js")
let Api = app.Api
Page({
  data: {
    indicatorDots: true,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 1,
    goods: [],
    pageSize: 10,
    curPage: 0,
    totalPage: 0,
    dataArray: [],
    scrollTop: "0",
    loadingMoreHidden: true,
    userId: ""
  },

  tabClick: function (e) {
    this.setData({
      curPage: 0,
      dataArray:[],
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  toDetailsTap: function (e) {
    router.push("indexInfo",{
      query:{id:e.currentTarget.dataset.id},
      openType:"navigateTo"
    })
    // wx.navigateTo({
    //   url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    // })
  },
  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  scroll: function (e) {
    //  console.log(e) ;
    var that = this,
      scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  
  },

  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName') == "" ? "聚优招聘" : wx.getStorageSync('mallName')
    })

    // 判断用户是否登录
    if (!store.getItem("userId")) {
      this.getSession();
    } else {
      //已经登陆了
      this.setData({
        userId: store.getItem("userId")
      })
      this.getFirstPage();
    }
  },

  // 获取登录的code
  getSession() {
    wx.login({
      success: res => {
        if (res.code) {
          // 获取openId
          app.post(Api.getSession, {
            code: res.code
          }, {}).then(res => {

            if (res.id != null) {
              store.setItem('userId', res.id);
              store.setItem('userInfo', res);
              this.setData({
                userId: res.id
              })
              this.getFirstPage();
            } else{
              wx.setStorageSync("openId", res.openid);
            }
          }).catch(err => {
            console.log(err.message)
          })
        }
      }
    })
  },
  //获取用户信息
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    userInfo.openid = store.getItem("openId");
    app.post(Api.login, 
       userInfo
    ,{}).then(res => {
      store.setItem('userId', res.id);
      store.setItem('userInfo', res);
      this.setData({
        userId: res.id
      })
      this.getFirstPage();
    })
  },

  getFirstPage () {
    var self = this;

    app.post(Api.headFindList, { parentId: 1},{}).then(res => {
      var categories = [];
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          categories.push(res[i]);
        }
      }
      self.setData({
        categories: categories,
        activeCategoryId: 1
      });
      self.setData({
        dataArray: []
      })
      self.getGoodsList(1);
   })
  },
  getGoodsList: function (categoryId) {
    //获取信息列表
    var that = this;
    app.post(Api.orderFindList, {
      orderType: categoryId,
      curPage: that.data.curPage + 1,
      pageSize: that.data.pageSize
    },{}).then(res => {

      that.setData({
        goods: [],
        loadingMoreHidden: true
      });
      var goods = [];
      if (res== null || res.size < 20) {
        that.setData({
          loadingMoreHidden: false,
        });
      }
      if(res== null || res.size <1){
        return;
      }
      for (var i = 0; i < res.size; i++) {
        goods.push(res.list[i]);
      }
      that.setData({
        ["dataArray[" + that.data.curPage + "]"]: goods,
      });
      that.setData({
        curPage: that.data.curPage + 1,
      });

   })
  },

  onPullDownRefresh: function () {
    //下拉刷新,重新初始化,isMerge = false
    var that = this;
    that.setData({
      curPage: 0,
    });
    that.setData({
      dataArray: []
    })
    this.getGoodsList(this.data.activeCategoryId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsList(this.data.activeCategoryId);
  },

  

  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})
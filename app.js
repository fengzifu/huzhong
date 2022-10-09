// app.js
let Api = require("./http/api.js");
let request = require("./http/request.js");
let config = require("./env/index.js")
let router = require("./utils/router.js")
let store = require("./utils/store.js")
let env = "Dev";
App.version = "1.0.0";
App.config = config[env]; // 公共文件用的

App({
  config: config[env], // 给视图用的
  Api,
  router,
  store,
  get: request.fetch,
  post: (url, data, option) => {
    option.method = "post";
    return request.fetch(url, data, option);
  },

  onLaunch: function () {
    var that = this;
    //  获取商城名称
    that.post(Api.getAppName, {
      configKey: 'productName'
    }, {}).then(res => {
      wx.setStorageSync('mallName', res.configValue);
    }).catch(err => {
      console.log(err.message)
    })

    this.login();
  },
  login: function () {
    
   
    
    // 判断用户是否登录
    // if (!store.getItem("userId")) {
    //   this.getSession();
    // }
  },
  // // 获取登录的code
  // getSession() {
  //   wx.login({
  //     success: res => {
  //       if (res.code) {
  //         // 获取openId
  //         this.post(Api.getSession, {
  //           code: res.code
  //         }, {}).then(res => {
  //           console.info(res)
  //           wx.setStorageSync("openId",res.openid);
  //         }).catch(err => {
  //           console.log(err.message)
  //         })
  //       }
  //     }
  //   })
  // },
  // getUserInfo(e){
  //   let userInfo = e.detail.userInfo;
  //   userInfo.openid = store.getItem("openId");
  //   /**
  //    * userInfo = {
  //    *   nick:"iwen",'
  //    *   city:"北京",
  //    *   openId:"34dfref4rer2fwdfe"
  //    * }
  //    */
  //   // app.get(Api.login,{
  //   //   userInfo
  //   // }).then(res =>{
  //   //   store.setItem('userId',res.userId);
  //   //   this.setData({
  //   //     userId:res.userId
  //   //   })
  // }
  // login : function () {
  //   var that = this;
  //   var token = that.globalData.token;
  //   if (token) {
  //     wx.request({
  //       url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/check-token',
  //       data: {
  //         token: token
  //       },
  //       success: function (res) {
  //         if (res.data.code != 0) {
  //           that.globalData.token = null;
  //           that.login();
  //         }
  //       }
  //     })
  //     return;
  //   }
  // wx.login({
  //   success: function (res) {
  //     wx.request({
  //       url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/user/wxapp/login',
  //       data: {
  //         code: res.code
  //       },
  //       success: function(res) {
  //         if (res.data.code == 10000) {
  //           // 去注册
  //           that.registerUser();
  //           return;
  //         }
  //         if (res.data.code != 0) {
  //           // 登录错误
  //           wx.hideLoading();
  //           wx.showModal({
  //             title: '提示',
  //             content: '无法登录，请重试',
  //             showCancel:false
  //           })
  //           return;
  //         }
  //         //console.log(res.data.data)
  //         that.globalData.token = res.data.data.token;
  //         that.globalData.uid = res.data.data.uid;
  //       }
  //     })
  //   }
  // })
  // }
})
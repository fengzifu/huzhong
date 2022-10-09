//index.js
//获取应用实例
var app = getApp();
let store = require("../../utils/store.js")
let router = require("../../utils/router.js")
let Api = app.Api

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail:{},
    swiperCurrent: 0,  
    hasMoreSelect:false,
    selectSize:"选择：",
    selectSizePrice:0,
    shopNum:0,
    hideShopPopup:true,//联系方式是否隐藏
    hideNeedNode:true,//注意事项
    hideCanYuZhe:true,//参与者
    buyNumber:0,
    buyNumMin:1,
    buyNumMax:0,
    // hidepaimaizhe: true,
    orderUsers:[],
    propertyChildIds:"",
    propertyChildNames:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo:{},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
    userInfo:{}//用户信息
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  onLoad: function (e) {
    this.setData({
      userInfo : store.getItem("userInfo"),
    })
    var that = this;
      // 获取openId
      app.post(Api.getOrderInfo, {
        id: e.id
      }, {}).then(res => {
       
        that.setData({
          goodsDetail: res,
        });
        
      }).catch(err => {
        console.log(err.message)
      })
  },
  /**
   * 显示参与者弹窗
   */
  showCanYuZhe: function () {
    //查询参与者赋值
    var that = this;
    app.post(Api.getOrderUser, {
      orderId: this.data.goodsDetail.id
    }, {}).then(res => {
     
      that.setData({
        orderUsers: res,
      });
      this.setData({
        hideCanYuZhe: false
      })
    }).catch(err => {
      console.log(err.message)
    })
  },
  agreeOrderUser:function(e){
    var that = this;
    app.post(Api.updateOrderUser, {
      id: e.currentTarget.dataset.id,
      status:2,
      updateUser:that.data.userInfo.id,
      updateUserName:that.data.userInfo.nickName
    }, {}).then(res => {
     this.showCanYuZhe()
    }).catch(err => {
      console.log(err.message)
    })
  },
  regectOrderUser:function(e){
    var that = this;
    app.post(Api.updateOrderUser, {
      id: e.currentTarget.dataset.id,
      status:4,
      updateUser:that.data.userInfo.id,
      updateUserName:that.data.userInfo.nickName
    }, {}).then(res => {
     this.showCanYuZhe()
    }).catch(err => {
      console.log(err.message)
    })
  },
  closeAuctionOrder: function () {
    //查询参与者赋值
    var that = this;
    app.post(Api.closeAuctionOrder, {
      id: this.data.goodsDetail.id
    }, {}).then(res => {
      that.setData({
        'goodsDetail.status':2
      }),
      wx.showToast({
        title: '关闭成功',
        icon: 'success',
        duration: 2000
      })
    }).catch(err => {
      console.log(err.message)
    })
   
  },
   /**
   * 显示注意事项
   */
  knowTips: function() {
    this.setData({  
     hideNeedNode:false
   })  
 },

  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
     this.setData({  
        hideShopPopup: false 
    })  
  },
  /**
   * 隐藏所有弹窗
   */
  closePopupTap: function() {
     this.setData({  
      hideCanYuZhe:true,
      hideShopPopup: true,
      // hidepaimaizhe: true ,
      hideNeedNode:true
    })  
  },
  numJianTap: function() {
     if(this.data.buyNumber > this.data.buyNumMin){
        var currentNum = this.data.buyNumber;
        currentNum--; 
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  numJiaTap: function() {
     if(this.data.buyNumber < this.data.buyNumMax){
        var currentNum = this.data.buyNumber;
        currentNum++ ;
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + app.globalData.uid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})

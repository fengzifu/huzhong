//index.js
var app = getApp()
Page({
  data: {
    goodsList:{
      saveHidden:true,
      totalPrice:0,
      allSelect:true,
      noSelect:false,
      list:[],
      lists:[]
    },
    delBtnWidth:120,    //删除按钮宽度单位（rpx）
  },
  

 //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  editTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  saveTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
  },
  bindAllSelect: function () {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },
  toPayOrder: function () {
    wx.showLoading();
    var that = this;
    if (this.data.goodsList.noSelect) {
      wx.hideLoading();
      return;
    }
    // 重新计算价格，判断库存
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      // shopList = shopCarInfoMem.shopList
      shopList = shopCarInfoMem.shopList.filter(entity => {
        return entity.active;
      });
    }
    if (shopList.length == 0) {
      wx.hideLoading();
      return;
    }
    var isFail = false;
    var doneNumber = 0;
    var needDoneNUmber = shopList.length;
    for (let i = 0; i < shopList.length; i++) {
      if (isFail) {
        wx.hideLoading();
        return;
      }
      let carShopBean = shopList[i];
      // 获取价格和库存
      if (!carShopBean.propertyChildIds || carShopBean.propertyChildIds == "") {
        wx.request({
          url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
          data: {
            id: carShopBean.goodsId
          },
          success: function (res) {
            doneNumber++;
            if (res.data.data.properties) {
              wx.showModal({
                title: '提示',
                content: res.data.data.basicInfo.name + ' 商品已失效，请重新购买',
                showCancel: false
              })
              isFail = true;
              wx.hideLoading();
              return;
            }
            if (res.data.data.basicInfo.stores < carShopBean.number) {
              wx.showModal({
                title: '提示',
                content: res.data.data.basicInfo.name + ' 库存不足，请重新购买',
                showCancel: false
              })
              isFail = true;
              wx.hideLoading();
              return;
            }
            if (res.data.data.basicInfo.minPrice != carShopBean.price) {
              wx.showModal({
                title: '提示',
                content: res.data.data.basicInfo.name + ' 价格有调整，请重新购买',
                showCancel: false
              })
              isFail = true;
              wx.hideLoading();
              return;
            }
            if (needDoneNUmber == doneNumber) {
              that.navigateToPayOrder();
            }
          }
        })
      } else {
        wx.request({
          url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/price',
          data: {
            goodsId: carShopBean.goodsId,
            propertyChildIds: carShopBean.propertyChildIds
          },
          success: function (res) {
            doneNumber++;
            if (res.data.data.stores < carShopBean.number) {
              wx.showModal({
                title: '提示',
                content: carShopBean.name + ' 库存不足，请重新购买',
                showCancel: false
              })
              isFail = true;
              wx.hideLoading();
              return;
            }
            if (res.data.data.price != carShopBean.price) {
              wx.showModal({
                title: '提示',
                content: carShopBean.name + ' 价格有调整，请重新购买',
                showCancel: false
              })
              isFail = true;
              wx.hideLoading();
              return;
            }
            if (needDoneNUmber == doneNumber) {
              that.navigateToPayOrder();
            }
          }
        })
      }

    }
  },
  deleteSelected: function () {
    var list = this.data.goodsList.list;
    /*
     for(let i = 0 ; i < list.length ; i++){
           let curItem = list[i];
           if(curItem.active){
             list.splice(i,1);
           }
     }
     */
    // above codes that remove elements in a for statement may change the length of list dynamically
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  jiaBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number < 10) {
        list[parseInt(index)].number++;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  jianBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  delItem: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  getSaveHide: function () {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  totalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.number;
      }
    }
    total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
    return total;
  },
  allSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].number
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },
  onLoad: function () {
      var list = [
        { 
          id:0,
          name:'波霸红',
          label:'成交价',
          price: '50元',
          pic:'https://cdn.it120.cc/apifactory/2019/01/15/89baf22ce56430e3617b77efca44dfdd.jpg',
          number: 1
        },
        {
          id: 1,
          name: '中国红',
          label: '成交价',
          price: '60元',
          pic:'https://cdn.it120.cc/apifactory/2019/01/15/89baf22ce56430e3617b77efca44dfdd.jpg',
          number: 2
        }
      
      ]
      var goods = {
        list: list
  
      }
      this.setData({
        goodsList : goods
      })
      this.initEleWidth();
      this.onShow();
  },
    navigateToPayOrder:function () {
      wx.hideLoading();
      wx.navigateTo({
        url:"/pages/to-pay-order/index"
      })
    }



})

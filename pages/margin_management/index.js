Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var status_list = [{
        id: 0,
        name: "波霸红",
        status: 2,
        date: "2020-03-27 09:04",
        price: 5
      },
      {
        id: 1,
        name: "中国红",
        status: 1,
        date: "2020-04-07 10:00",
        price: 5
      }
    ]
    this.setData({
      statusList: status_list,
      color0: 'red',
      color1: 'black',
      color2: 'black',
      color3: 'black'
    })
  },
  onStatus: function(event) {
    var status = event.currentTarget.dataset.status;
    console.info(status)
    if (status == 0) {
      this.setData({
        color0: 'red',
        color1: 'black',
        color2: 'black',
        color3: 'black'
      })
    } else if( status == 1){
      console.info(status)
      this.setData({
        color0: 'black',
        color1: 'red',
        color2: 'black',
        color3: 'black'
      })
    } else if(status == 2){
      this.setData({
        color0: 'black',
        color1: 'black',
        color2: 'red',
        color3: 'black'
      })
    } else if (status == 3){
      this.setData({
        color0: 'black',
        color1: 'black',
        color2: 'black',
        color3: 'red'
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  toDetail: function(event){
    var id = event.currentTarget.dataset.id;
    console.info("调用后台接口根据id进入详情页面-------id="+id)
  }
})
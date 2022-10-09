Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var questions = [{
        id: 0,
        title: "什么是保证金？",
        answer: "1.汉仪尚巍手书 这款字体大家应该不陌生,因为我之前推荐过。非常有气场的一款字体"
      },
      {
        id: 1,
        title: "什么是保证金？",
        answer: "腾祥伯当行楷简 腾祥伯当行楷简是一款融合了楷体、行书的新型字体,这款字体字形十分优美..."
      },
      {
        id: 2,
        title: "什么是保证金？",
        answer: "3.潮字社凌渡鲲鹏字体 潮字社凌渡鲲鹏字体是我最近发现的一款字体,真的非常大气,有一种毛笔字..."
      }
    ]
    this.setData({
      questionList: questions
    })
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

  }
})
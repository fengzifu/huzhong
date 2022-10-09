module.exports = {
  getSession:"/user/getSession",
  login:"/user/login",
  //查询小程序名称
  getAppName:"/recruitConfig/findByConfigKey",
  //查询导航头
  headFindList:"/auctionCategory/findList",
  //获取订单列表
  orderFindList:"/auctionOrder/findPageList",
  //获取订单详情
  getOrderInfo:"/auctionOrder/findAuctionOrderById",
  //获取参与者
  getOrderUser:"/auctionOrder/findOrderUseByOrderId",
  //修改订单子表状态
  updateOrderUser:"/orderUser/updateOrderUser",
  //关闭订单
  closeAuctionOrder:"/auctionOrder/closeAuctionOrder"
}
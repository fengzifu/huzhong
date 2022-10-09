/**
 * 路由跳转
 */

// 映射
const routerPath = {
  "index":"/pages/index/index",
  //跳转详情页
  "indexInfo":"/pages/goods-details/index"
}

module.exports = {
  // this.$router.push("/index",{path:"/index",query:{}})
  // /index?name=iwen&age=20  query={ name:'iwen',age:20 }   axios  fetch post参数类型 querystring
  push(path,option={}){
    if(typeof path === 'string'){
      option.path = path;
    }else{
      option = path;
    }

    // 获取url : "index"
    let url = routerPath[option.path];
    // openType跳转类型
    let { query = {}, openType } = option;
    let params = this.parse(query);//转成string类型
    if(params){
      url += '?' + params;
    }
    this.to(openType,url);
  },
  to(openType,url){
    let obj = { url }; //  { url:"..." }
    if(openType === 'switchTab'){
      //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      wx.switchTab(obj);
    }else if (openType === 'redirectTo'){
      //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
      wx.redirectTo(obj);
    } else if (openType === 'reLaunch'){
      //关闭所有页面，打开应用内的某个页面
      wx.reLaunch(obj);
    } else if (openType === 'navigateBack'){
      //关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
      wx.navigateBack({
        delta:1
      })
    }else{
      //保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
      wx.navigateTo(obj);
    }
  },
  parse(data){
    let arr =[];
    for(let key in data){
      arr.push(key + '=' +data[key]);
    }
    return arr.join("&");
  }
}
var app = getApp()
Page({
  data: {
    isShow: true,
    isShow2: true,
    //上方轮播图
    selectImageList: [],
    topPicture: [],
    //详情图片
    selectImageIntroduceList: [],
    downPicture:[],
    array: [],
    objectArray: [
    ],
    //类型
    index: 0,

    promiseArray: ['5', '10', '20', '50', '100', '200', '500', '1000'],
    objectPromiseArray: [{
        id: 0,
        name: '5'
      },
      {
        id: 1,
        name: '10'
      },
      {
        id: 2,
        name: '20'
      },
      {
        id: 3,
        name: '50'
      }, {
        id: 4,
        name: '100'
      },
      {
        id: 5,
        name: '200'
      },
      {
        id: 6,
        name: '500'
      },
      {
        id: 7,
        name: '1000'
      }
    ],
    //保证金
    promiseIndex: 0,

    multiArray: [],
    objectMultiArray: [],
    multiIndex: [0, 0, 0],
    multiArray2: [],
    startTime:"请选择开始时间",
    objectMultiArray2: [],
    multiIndex2: [0, 0, 0],
    endTime:"请选择结束时间",
    date: '2016-09-01',
    time: '12:01',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    hourIndex: [],
    minIndex:[],
    hourIndex2: [],
    minIndex2: [],
    //拍品名称
    orderName:"",
    //拍品文字详情
    charactersDetails:"",
    //起拍价
    startPrice:"",
    //加价幅度
    addPrice:"",
    //快递费
    expressPrice:"",
    //参考价
    referencePrice:""
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://juyoupaimai.picp.vip/paimai/auctionCategory/findList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var categories = [];
        var arrayList =[];
        if (res.data.code == 1) {
          for (var i = 0; i < res.data.data.length; i++) {
            let objectArrayOne ={};
            objectArrayOne.id= i;
            objectArrayOne.name = res.data.data[i].categoryName;
            categories.push(objectArrayOne);
            arrayList.push(res.data.data[i].categoryName);
          }
        }       
        that.setData({
          array: arrayList,
          objectArray: categories,
          index: 0
        });
      }
    })

    var date = new Date();
    var dayIndex = date.getDate();
    var timeListStr =[];
    var timeListIndexStr = [];
    var timeStr = "立即";
    var timeIndex ={};
    timeIndex.id=0;
    timeIndex.name = timeStr;
    timeListIndexStr.push(timeIndex);
    timeListStr.push(timeStr);
    for(var i=0;i<8;i++){
      date.setDate(dayIndex + i);
      var month = date.getMonth() + 1
      var day = date.getDate();
      var timeStr = "" + month + "月" + day+"日";
      timeIndex.id = i+1;
      timeIndex.name = timeStr;
      timeListIndexStr.push(timeIndex);
      timeListStr.push(timeStr);
    }
    var time1 = [timeListStr,[],[]]
    var time2 = [timeListIndexStr, [], []]
    var time3 = [timeListStr, [], []]
    var time4 = [timeListIndexStr, [], []]

    var hourStr = [];
    var minStr = [];
    for (var i = 0; i < 24; i++){
      var j;
      if(i<10){
        j = "0"+i
      }else{
        j = ""+i
      }
      hourStr.push(j);
    }
    for (var i = 1; i < 60; i++) {
      var j;
      if(i%5==0){
        if (i < 10) {
          j = "0" + i
        } else {
          j = ""+i
        }
        minStr.push(j);
      }
    }

    that.setData({
      multiArray: time1,
      objectMultiArray: time2,
      multiArray2: time3,
      objectMultiArray2: time4,
      hourIndex: hourStr,
      minIndex: minStr,
      hourIndex2: hourStr,
      minIndex2: minStr
    });


  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindPromisePickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      promiseIndex: e.detail.value
    })
  },

  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2,
      startTime: this.data.startTime,
      endTime:this.data.endTime
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        //判断改的第几列
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [];
            data.multiArray[2] = [];
            break;
  
          default:
            data.multiArray[1] = this.data.hourIndex;
            data.multiArray[2] = this.data.minIndex;
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        //改的第二列，先判断第一列的位置，再判断第二列位置
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[2] = [];
            break;
          default:
            data.multiArray[2] = this.data.minIndex
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    var timeIndex = data.multiIndex;
    var timeList = data.multiArray;
    var timeIndex2 = data.multiIndex2;
    var timeList2 = data.multiArray2;
    var startDate;
    var endDate;
    if (timeIndex[0]==0){
      data.startTime = '立即开始';
    } else{
      var date = new Date();
      var year = date.getFullYear();
      var start = year+"/" + data.multiArray[0][timeIndex[0]] + " " + data.multiArray[1][timeIndex[1]] + ":" + data.multiArray[2][timeIndex[2]];
      var st = start.replace("月", "/").replace("日", "/");
      startDate = new Date(st);
      if (startDate.getTime() <= date.getTime()){
        data.startTime = '开始时间不能小于当前时间';
      }else{
        data.startTime = year + "年" + data.multiArray[0][timeIndex[0]] + " " + data.multiArray[1][timeIndex[1]] + ":" + data.multiArray[2][timeIndex[2]];
      }
      console.info(date);
    }
    if (timeIndex2[0] == 0) {
      data.endTime = '请选择结束时间';
    }else{
      let date = new Date();
      var year = date.getFullYear();
      var end = year + "/" + data.multiArray2[0][timeIndex2[0]] + " " + data.multiArray2[1][timeIndex2[1]] + ":" + data.multiArray2[2][timeIndex2[2]];
      var en = end.replace("月", "/").replace("日", "/");
      endDate = new Date(en);
    }
    if (data.startTime != '立即开始' && data.endTime != '请选择结束时间'){
      if (startDate.getTime() >= endDate.getTime()){
        data.startTime = '开始时间必须小于结束时间';
      }
    }
    this.setData(data);
  },


  bindMultiPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex2: e.detail.value
    })
  },
  bindMultiPickerColumnChange2: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2,
      startTime: this.data.startTime,
      endTime: this.data.endTime
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        //判断改的第几列
        switch (data.multiIndex2[0]) {
          case 0:
            data.multiArray2[1] = [];
            data.multiArray2[2] = [];
            break;

          default:
            data.multiArray2[1] = this.data.hourIndex2;
            data.multiArray2[2] = this.data.minIndex2;
            break;
        }
        data.multiIndex2[1] = 0;
        data.multiIndex2[2] = 0;
        break;
      case 1:
        //改的第二列，先判断第一列的位置，再判断第二列位置
        switch (data.multiIndex2[0]) {
          case 0:
            data.multiArray2[2] = [];
            break;
          default:
            data.multiArray2[2] = this.data.minIndex2
            break;
        }
        data.multiIndex2[2] = 0;
        break;
    }
    console.log(data.multiIndex2);
    var timeIndex = data.multiIndex;
    var timeList = data.multiArray;
    var timeIndex2 = data.multiIndex2;
    var timeList2 = data.multiArray2;
    var startDate;
    var endDate;
    if (!(data.startTime == '请选择开始时间' || data.startTime == '立即开始')) {
      var date = new Date();
      var year = date.getFullYear();
      var start = year + "/" + data.multiArray[0][timeIndex[0]] + " " + data.multiArray[1][timeIndex[1]] + ":" + data.multiArray[2][timeIndex[2]];
      var st = start.replace("月", "/").replace("日", "/");
      startDate = new Date(st);
      if (startDate.getTime() <= date.getTime()) {
        data.startTime = '开始时间不能小于当前时间';
      } else {
        data.startTime = year + "年" + data.multiArray[0][timeIndex[0]] + " " + data.multiArray[1][timeIndex[1]] + ":" + data.multiArray[2][timeIndex[2]];
      }
      console.info(date);
    }
    if (timeIndex2[0] == 0) {
      data.endTime = '请选择结束时间';
    } else {
      let date = new Date();
      var year = date.getFullYear();
      var end = year + "/" + data.multiArray2[0][timeIndex2[0]] + " " + data.multiArray2[1][timeIndex2[1]] + ":" + data.multiArray2[2][timeIndex2[2]];
      var en = end.replace("月", "/").replace("日", "/");
      endDate = new Date(en);
      if (endDate.getTime() <= date.getTime()) {
        data.endTime = '结束时间不能小于当前时间';
      } else {
        data.endTime = year + "年" + data.multiArray2[0][timeIndex2[0]] + " " + data.multiArray2[1][timeIndex2[1]] + ":" + data.multiArray2[2][timeIndex2[2]];
      }

    }
    if (data.startTime != '请选择开始时间' && data.startTime != '立即开始') {
      if (startDate.getTime() > endDate.getTime()) {
        data.endTime = '开始时间必须小于结束时间';
      }
    }
    this.setData(data);
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  selectBottom() {
    const selectNum = this.data.selectImageList.length;
    const num = 3 - selectNum;
    num != 0 && wx.chooseImage({
      count: num,
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let newList = this.data.selectImageList;
        for (let i = 0; i < tempFilePaths.length; i++) {
          newList.push(tempFilePaths[i]);
        }

        newList.length == 3 ? this.setData({
          isShow: false
        }) : null;
        this.setData({
          selectImageList: newList
        }, () => {
          console.log(this.data.selectImageList)
        })

        let topList = this.data.topPicture;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://juyoupaimai.picp.vip/paimai/fastdfs/uploadImageSample', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
            'user': 'test'
            },
            success(res) {
              var url = res.data
              topList.push(url)

              this.setData({
                topPicture: topList
              })
            //do something
            }
          })
        }
       
        // console.log("tempFilePaths:"+JSON.stringify(tempFilePaths))
      }
    })
  },

  closeOption(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let imagelist = this.data.selectImageList;
    imagelist.splice(index, 1);
    let topPictures = this.data.topPicture;
    topPictures.splice(index, 1);
    this.setData({
      selectImageList: imagelist,
      topPicture: topPictures,
      isShow: true
    })
    console.log(JSON.stringify(e))

  },

  selectBottom2() {
    const selectNum = this.data.selectImageIntroduceList.length;
    const num = 3 - selectNum;
    num != 0 && wx.chooseImage({
      count: num,
      success: (res) => {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let newList = this.data.selectImageIntroduceList;
        for (let i = 0; i < tempFilePaths.length; i++) {
          newList.push(tempFilePaths[i]);
        }

        newList.length == 10 ? this.setData({
          isShow2: false
        }) : null;
        this.setData({
          selectImageIntroduceList: newList
        }, () => {
          console.log(this.data.selectImageIntroduceList)
        })

        let downList = this.data.downPicture;
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://juyoupaimai.picp.vip/paimai/fastdfs/uploadImageSample', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success(res) {
              var url = res.data
              downList.push(url)

              this.setData({
                downPicture: downList
              })
              //do something
            }
          })
        }

        // console.log("tempFilePaths:"+JSON.stringify(tempFilePaths))
      }
    })
  },

  closeOption2(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let imagelist = this.data.selectImageIntroduceList;
    imagelist.splice(index, 1);
    let downPictures = this.data.downPicture;
    downPictures.splice(index, 1);
    this.setData({
      selectImageIntroduceList: imagelist,
      downPicture: downPictures,
      isShow2: true
    })
    console.info(JSON.stringify(e))

  },
  //拍品名称 orderName
  //拍品文字详情 charactersDetails
  //起拍价 startPrice
  //加价幅度 addPrice
  //快递费 expressPrice
  //参考价 referencePrice
  getOrderName(e) {
    this.setData({
      orderName: e.detail.value
    })
  },
  getCharactersDetails(e) {
    this.setData({
      charactersDetails: e.detail.value
    })
  },
  getStartPrice(e) {
    this.setData({
      startPrice: e.detail.value
    })
  },
  getAddPrice(e) {
    this.setData({
      addPrice: e.detail.value
    })
  },
  getExpressPrice(e) {
    this.setData({
      expressPrice: e.detail.value
    })
  },
  getReferencePrice(e) {
    this.setData({
      referencePrice: e.detail.value
    })
  },

  creatAuction: function (e) {
    var auction = this.data;
  }


})
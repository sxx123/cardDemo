// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data:{
    daka:'打卡',
    maddress:'',
    curraddress:'请先进行打卡',
    username:0,
  },
  cardBtn:function(){
    var that= this;
    var xuehao = that.data.username
    console.log(xuehao)
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
         // 调用接口
        qqmapsdk.reverseGeocoder({
          //String格式
          location:{
            latitude:latitude,
            longitude:longitude
          },
          success: function(res) {//成功后的回调
            that.setData({
              curraddress:res.result.formatted_addresses.recommend,
            })
            if(that.data.curraddress != that.data.maddress){
              that.setData({
                daka:'打卡失败'
              })
              wx.cloud.database().collection('student').doc(xuehao).get({
                success(res){
                  console.log(res)
                  var id=xuehao
                  var nameF=res.data.name
                  var studentclassF=res.data.studentclass
                  var phoneF=res.data.phone
                  var curraddressF=that.data.curraddress
                  wx.cloud.database().collection('failCard').add({
                    data:{
                      _id:xuehao,
                      name:nameF,
                      studentclass:studentclassF,
                      phone:phoneF,
                      curraddress:curraddressF
                    },
                    success(res){
                      console.log(res.data)
                    }
                  })
                },
                fail(res){
                  console.log("查询失败",res)
                }
              })
              wx.showModal({
                title: '提示',
                content:'打卡失败,请到规定范围内打卡',
                success (res) {
                  if (res.confirm) {
                    that.setData({
                      daka:'打卡'
                    })
                  } else if (res.cancel) {
                    that.setData({
                      daka:'打卡失败'
                    })
                  }
                } 
              })
            }else{
              that.setData({
                daka:'已打卡'
              })
            }
          },
          fail: function(error) {
            console.error(error);
          }
        })
      }
     })
  },
  onShow:function(){
       // 调用接口
    var that = this;
    qqmapsdk.reverseGeocoder({
      //String格式
      location: '30.563042,103.969948',
      success: function(res) {//成功后的回调
        that.setData({
          maddress:res.result.formatted_addresses.recommend
        })
      },
      fail: function(error) {
        console.error(error);
      }
    })
    wx.getStorage({
      key: 'username',
      success (res) {
        var  username=that.data.username
        that.setData({
          username:res.data
        })
      }
    })
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
        key: 'UCMBZ-4J53P-VOGDR-LICOT-NIPL6-34BBN'
    });
},
})
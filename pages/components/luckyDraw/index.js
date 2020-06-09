// pages/components/luckyDraw/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [
      { img: '../../repository/images/item.png', name: '奖一', usname: true },
      { img: '../../repository/images/item.png', name: '奖二', usname: true },
      { img: '../../repository/images/item.png', name: '奖三', usname: false },
      { img: '../../repository/images/item.png', name: '奖四', usname: true },
      { img: '../../repository/images/item.png', name: '奖五', usname: true },
      { img: '../../repository/images/item.png', name: '奖六', usname: true },
      { img: '../../repository/images/item.png', name: '奖七', usname: true },
      { img: '../../repository/images/item.png', name: '奖八', usname: true },
    ],
    frequency: '4',   //  抽奖次数
    luckdraw: true,   //  停止位置不可编辑
    cuvin: null,
    interval: '',
    answer: 0,  //参数值，决定中奖选项，0为随机数
    delay: '',
    pstakes: '0',
    numx: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.detail.splice(4, 0, { name: '立即抽奖' })
    this.setData({
      detail: this.data.detail
    })
  },
  //  设置中奖结果
  stopinput: function (e) {
    var les = Math.floor(Math.random() * 10 + 1);
    if (e.detail.value!=-1){
      les = e.detail.value
    }
    this.setData({
      answer: les
    })
  },
  luckdraw: function (e) {
    let that = this
    that.setData({    //  避免重复操作
      luckdraw: false
    })
    //  没有抽奖机会跳出  start
    if (that.data.frequency <= 0) {
      wx.showToast({
        title: '您已没有抽奖次数',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        luckdraw: true
      })
      return false
    }
    //  没有抽奖机会跳出  end
    //  没有数据和没有跳出  start
    if ((that.data.detail.length - 1) <= that.data.answer || that.data.answer < 0) {
      wx.showToast({
        title: '系统异常~',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        luckdraw: true
      })
      return false
    }
    //  没有数据和没有跳出  end
    if ('4' <= that.data.answer) {    //  如果是抽奖按钮，跳过本次选项
      that.data.answer++
    }
    that.data.delay = '100' 
    that.data.frequency--
    that.data.cuvin = -1  //  修改默认值？
    that.data.interval = setInterval(function () {
      that.data.cuvin++
      if (that.data.cuvin == 4) {
        that.data.cuvin++
      }
      if ((that.data.detail.length) < that.data.cuvin) {
        that.data.cuvin = 0
        that.againdraw();
      }
      that.setData({
        cuvin: that.data.cuvin
      })
    }, that.data.delay)
    that.setData({
      frequency: that.data.frequency,
      delay: that.data.delay,
      answer: that.data.answer,
    })
  },
  
  againdraw: function (e) {
    let that = this
    clearInterval(that.data.interval)
    if (that.data.delay == '100') {
      that.data.delay = '125'
    } else if (that.data.delay == '125') {
      that.data.delay = '200'
    } else if (that.data.delay == '200') {
      that.data.delay = '300'
      let num = that.data.answer
      if ('4' <= that.data.answer) {
        num = num - 2
      } else {
        num--
      }
      that.data.numx = (600 - parseInt(600 - that.data.delay)) / num
    }
    that.setData({
      delay: that.data.delay,
      numx: parseInt(that.data.numx),
    })
    that.data.interval = setInterval(function () {
      that.data.cuvin++
      if ('4' == that.data.cuvin) {
        that.data.cuvin++
      }
      if (that.data.delay <= '200') {
        if ((that.data.detail.length) < that.data.cuvin) {
          that.data.cuvin = 0
          that.againdraw(that.data.cuvin);
        }
        that.setData({
          cuvin: that.data.cuvin
        })
      } else if ('300' <= that.data.delay) {
        that.data.delay = parseInt(that.data.delay) + that.data.numx
        that.setData({
          cuvin: that.data.cuvin,
          delay: that.data.delay
        })

        var ans = Math.floor(Math.random() * 9 + 1);
        that.data.answer = ans
        that.reward();
        that.setData({
          luckdraw: true,
          cuvin: ans,
          answer: ans,
        })
        clearInterval(that.data.interval)

        // if (that.data.answer == '0') {
        //   that.reward();
        //   that.setData({
        //     luckdraw: true,
        //     cuvin: 0,
        //   })
        //   clearInterval(that.data.interval)
        // }
        // if (that.data.cuvin == that.data.answer) {
        //   that.reward();
        //   that.setData({
        //     luckdraw: true,
        //   })
        //   clearInterval(that.data.interval)
        // } else {
        //   that.againdraw();
        // }
      }
    }, that.data.delay)
    that.setData({
      delay: that.data.delay,
    })
  },
  //  抽奖结果显示
  reward: function (e) {
    wx.showModal({
      title: '提示',
      content: this.data.detail[this.data.answer].name ? '恭喜您，中奖了' + this.data.detail[this.data.answer].name : '很遗憾，没有中奖'+this.data.detail[this.data.answer].name,
      // content: this.data.detail[this.data.answer].name ? '恭喜您，中奖了' : '很遗憾，没有中奖',
      showCancel: false,
    })
    if (5 <= this.data.answer) {
      this.setData({
        answer: this.data.answer - 1,
      })
    }
  },
})
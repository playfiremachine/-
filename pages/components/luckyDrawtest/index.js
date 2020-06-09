Page({
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
      { img: '/images/item1.png', name: '有奖', usname: true },
      { img: '/images/item1.png', name: '有奖2', usname: true },
    ],
    frequency: '4',   //  抽奖次数
    luckdraw: true,   //  停止位置不可编辑
    cuvin: null,
    interval: '1',
    answer: 0,  //参数值，决定中奖选项，0为随机数
    delay: '',
    pstakes: '1',
    numx: '',
  },
  onLoad: function (options) {
    this.data.detail.splice(5, 0, { name: '立即抽奖' })
    this.setData({
      detail: this.data.detail
    })
  },
  //  设置中奖结果
  stopinput: function (e) {
    this.setData({
      answer: e.detail.value
    })
  },
  luckdraw: function (e) {
    let that = this
    that.setData({
      luckdraw: false
    })
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
    if ('5' <= that.data.answer) {
      that.data.answer++
    }
    that.data.delay = '100'
    that.data.frequency--
    that.data.cuvin = -1
    that.data.interval = setInterval(function () {
      that.data.cuvin++
      if (that.data.cuvin == 5) {
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
      if ('5' <= that.data.answer) {
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
      if ('5' == that.data.cuvin) {
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

        if (that.data.answer == '0') {
          that.reward();
          that.setData({
            luckdraw: true,
            cuvin: 0,
          })
          clearInterval(that.data.interval)
        }
        
        if (that.data.cuvin == that.data.answer) {
          that.reward();
          that.setData({
            luckdraw: true,
          })
          clearInterval(that.data.interval)
        } else {
          that.againdraw();
        }
      }
    }, that.data.delay)
    that.setData({
      delay: that.data.delay,
    })
  },
  reward: function (e) {
    wx.showModal({
      title: '提示',
      content: this.data.detail[this.data.answer].usname ? '恭喜您，中奖了' + this.data.detail[this.data.answer].name : '很遗憾，没有中奖' + this.data.detail[this.data.answer].name,
      showCancel: false,
    })
    if (5 <= this.data.answer) {
      this.setData({
        answer: this.data.answer - 1,
      })
    }
  },
})
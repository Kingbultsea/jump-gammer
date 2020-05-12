/* eslint-disable */
import axios from 'axios'
const APPID = ''
let URL = ''

export default class Share {
  constructor ({ url, title, desc, pic, dataUrl = null }) {
    // console.log('??')
    URL = url
    this.url = url
    this.title = title
    this.desc = desc
    this.pic = pic
    this.dataUrl = dataUrl // 第一次启动的是appInit
  }

  weiXinShare () {
    const that = this
    const message = {
      title: that.title,
      desc: that.desc,
      link: that.url,
      imgUrl: that.pic // +'?imageView&thumbnail=400x0&quality=75&tostatic=0'
    }
    if (this.dataUrl) {
      // message.type = 'music'
      // message.dataUrl = this.dataUrl
    }
    wx.ready(function (res) {
      wx.onMenuShareAppMessage(message)
      wx.onMenuShareQQ(message)
      wx.onMenuShareQZone(message)
      wx.onMenuShareTimeline(message)
      wx.error((res) => {
        // alert(res)
      })
    })
  }

  weiXinSDK (url, bl) {
    const getappid = new XMLHttpRequest()
    const that = this
    getappid.open('GET', url + '/web/v1/wechat/config?debug=1&url=' + encodeURIComponent(location.href.split('#')[0]))
    getappid.onreadystatechange = function () {
      if (getappid.readyState === 4 && getappid.status === 200) {
        let getSDK = JSON.parse(getappid.response)
        getSDK.data.wechat_config.debug = false
        const appid = APPID
        const redirtUrl = process.env.NODE_ENV === 'production' && process.env.VUE_APP_TITLE !== 'experiment' ? true : false
        if (redirtUrl) { // 正式
          if (bl && !localStorage.getItem('name')) {
            window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +  '&redirect_uri=' + encodeURIComponent(location.href.split('#')[0]) +'&response_type=code&scope=snsapi_userinfo#wechart_redirect')
          }
        } else { // 测试
          if (bl && !localStorage.getItem('name')) {
            window.location.replace(window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid +  '&redirect_uri=' + encodeURIComponent('' + encodeURIComponent(location.href.split('#')[0])) +'&response_type=code&scope=snsapi_userinfo#wechart_redirect')
          }
        }

        if (!bl || localStorage.getItem('name')) {
          wx.config(getSDK.data.wechat_config)
          // that.weiXinShare()
          that.weiXinGetName(url).catch(() => {
            weiXinSDK(window.location.href.split('?')[0], true)
            // code 错误
            // window.location.href = window.location.href.split('?')[0]
          })
        }
      }
    }
    getappid.send()
  }

  weatherCode () {
    const code = parseQuery(window.location.href).code
    // console.log(code)
    code && localStorage.setItem('code', code)

    if (code) { return code } else {
      return false
    }
  }

  weiXinGetName (url) {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('name') || !localStorage.getItem('openid')) {
        const code = localStorage.getItem('code').replace(/code=/, '').replace(/\&.+/, '')
        axios.get(url + '/web/v1/wechat/user', { params: { code } }).then((res) => { // weixinUserData type:   root.d.ts
          const data = res.data
          if (data.hasOwnProperty('data')) {
            localStorage.setItem('avatar', data.data.headimgurl)
            localStorage.setItem('name', data.data.nickname)
            localStorage.setItem('openid', data.data.openid)
            localStorage.setItem('sex', data.data.sex)
            localStorage.setItem('city', data.data.city)
            localStorage.setItem('country', data.data.country)
            localStorage.setItem('province', data.data.province)
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      } else {
        resolve()
      }
    })
  }

  weiXinInit (url) {
    const code = this.weatherCode()
    if (code) {
      this.weiXinSDK(url, false)
    } else {
      this.weiXinSDK(url, true)
    }
    // code ? '' : this.weiXinSDK(url, true) // this.weiXinSDK(url, false) 拥有code 也不获取
  }

  appInit () {
    this.appShare()
    this.appGetName()
  }

  rawWeiXinShare (url) {
    const getappid = new XMLHttpRequest()
    const that = this
    getappid.open('GET', url + '/web/v1/wechat/config?debug=1&url=' + encodeURIComponent(location.href.split('#')[0]))
    getappid.onreadystatechange = function () {
      if (getappid.readyState === 4 && getappid.status === 200) {
        // console.log('sdk ok')
        let getSDK = JSON.parse(getappid.response)
        // console.log(getSDK.data.wechat_config)
        getSDK.data.wechat_config.debug = false

        wx.config(getSDK.data.wechat_config)
        that.weiXinShare()
      }
    }
    getappid.send()
  }

  rawGetName () {
    /* if (!localStorage.getItem('name')) {
      console.log(code + 'asd你想要的' + localStorage.getItem('code'))
      const code = localStorage.getItem('code').replace(/code=/, '').replace(/\&.+/, '')

      $.get(url + '/web/v1/wechat/user', { code }, (data) => {
        console.log('jq都不行？'); console.log(data.data.nickname)
        localStorage.setItem('name', data.data.nickname)
      })
    } */
  }
}

function parseQuery(url) {
  let queryObj = {}
  let reg = /[?&]([^=&#]+)=([^&#]*)/g
  let querys = url.match(reg)
  if (querys) {
    for (let i in querys) {
      let query = querys[i].split('=')
      let key = query[0].substr(1)
      let value = query[1]
      queryObj[key] ? queryObj[key] = [].concat(queryObj[key], value) : queryObj[key] = value
    }
  }
  return queryObj
}

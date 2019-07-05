
import axios from 'axios'

const host = process.env.NODE_ENV === 'development' ? 'https://oapi.zhuniu.com' : "https://oapi.zhuniu.com" 

// http://api.jp.test.zhuniu.com
// 根据 process.env.NODE_ENV 的值判断当前是什么环境

const instance = axios.create({
    baseURL: host,
})

export default ({ app }, inject) => {
    inject('request', instance);
  }

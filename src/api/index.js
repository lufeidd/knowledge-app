/*
 * api
 * author: nancyzeng
 * date: 2019/03/14
 */
const _axios = require('axios')
const _loginApi = 'https://api.coindesk.com/v1/bpi/currentprice.json'

export default {
  loginApi: _loginApi,
  axios: _axios
}

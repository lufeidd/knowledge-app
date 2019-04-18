/*
 * api
 * author: nancyzeng
 * date: 2019/03/14
 */

const _axios = require('axios');

// const _loginApi = 'https://api.coindesk.com/v1/bpi/currentprice.json'
const _loginApi = 'http://198.210.100.118:8002' 

export default {
  loginApi: _loginApi,
  axios: _axios,
  encrypt(key, data) {
    let publicKey = key;
    let encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    let rsaPassWord = encryptor.encrypt(data);
    console.log('encrypt:', data);
    return data;
  }
}

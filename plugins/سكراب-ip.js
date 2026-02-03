import axios from 'axios'
const ipinfoToken = '882ffefc502ce1'; 

async function getIPInfo(ip) {
    const response = await axios.get(`http://ipinfo.io/${ip}/json?token=882ffefc502ce1`);
    return response.data;
  }

export {
getIPInfo
}
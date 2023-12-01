import axios from 'axios';

const getListFile = async (ipAddressId, fileName) => {
  const response = await axios.get(`http://localhost:8080/get-list-file?ipAddressId=${ipAddressId ?? ''}&fileName=${fileName ?? ''}`);
  const { data } = response

  return data
}

const downloadFile = async (fileId) => {
  const response = await axios.get(`http://localhost:8080/download?fileId=${fileId}&ipAddress`, {
    headers: {
        'Content-Type': 'application/json',
    }
})
  const { data } = response

  return data
}

const deleteFile = async (fileId) => {
  const response = await axios.delete(`http://localhost:8080/delete?fileId=${fileId}&ipAddress=&note=Un-necessary`)
  const { data } = response

  return data
}

const getListIp = async () => {
  const response = await axios.get(`http://localhost:8080/get-list-ip`)
  const { data } = response

  return data
}

const getAddress = async () => {
  const response = await axios.get(`https://geolocation-db.com/json/`)
  const { data } = response

  return data
}


export {
  getListFile,
  downloadFile,
  deleteFile,
  getListIp,
  getAddress
}
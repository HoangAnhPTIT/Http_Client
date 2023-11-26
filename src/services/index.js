import axios from 'axios';

const getListFile = async () => {
  const response = await axios.get('http://localhost:8080/get-list-file');
  const { data } = response

  return data
}

const downloadFile = async (fileName) => {
  const response = await axios.get(`http://localhost:8080/download?fileName=${fileName}`, {
    responseType: 'arraybuffer',
    headers: {
        'Content-Type': 'application/json',
    }
})
  const { data } = response

  return data
}

export {
  getListFile,
  downloadFile
}
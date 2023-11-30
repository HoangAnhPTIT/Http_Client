import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { getAddress } from '../services';
// eslint-disable-next-line react/prop-types
const UploadFiles = ({ afterUpload }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const getIp = async () => {
    const address = await getAddress();

    return address.IPv4
  }

  const handleUpload = () => {
    const handler = async () => {
      const formData = new FormData();
      console.log('fileList', fileList)
      fileList.forEach((file) => {
        formData.append('file', file);
      });

      const ip = await getIp();
      formData.append('ipAddress', ip)
      formData.append('note', 'note')
      setUploading(true);

      // You can use any AJAX library you like
      fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(() => {
          setFileList([]);
          message.success('upload successfully.');
        })
        .catch(() => {
          message.error('upload failed.');
        })
        .finally(() => {
          setUploading(false);
        });

      if(afterUpload) afterUpload()
    }

    handler()
  };


  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  return (
    <div className='upload-section'>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{
          marginLeft: 10,
        }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </div>
  );
};
export default UploadFiles;
import { useEffect, useState } from 'react'
import './App.css'
import { Button, Table, Upload } from 'antd';
import { downloadFile, getListFile } from './services';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';


function App() {
  const [files, setFiles] = useState([])
  const [isLoadingDownloadBtn, setIsLoadingDownloadBtn] = useState(false)
  const [reload, setReload] = useState(false)
  useEffect(() => {
    const handler = async () => {
      const data = await getListFile();
      console.log('data', data)
      setFiles(data.data)
    }

    handler()
  }, [reload])

  const handleDownload = async (fileName) => {
    setIsLoadingDownloadBtn(true)
    const response = await downloadFile(fileName)

    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setIsLoadingDownloadBtn(false)
  }

  const columns = [
    {
      title: 'Tên file',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Kích thước (bytes)',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: 'Tải xuống',
      key: 'download',
      render: (record) => {
        return (
          <Button
            type="primary"
            icon={<DownloadOutlined />} size="small"
            loading={isLoadingDownloadBtn}
            onClick={() => handleDownload(record.fileName)}>
            Download
          </Button>)
      }
    },
  ];
  const props = {
    name: 'file',
    action: 'http://localhost:8080/upload',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        setReload(!reload)
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className='container'>
      <div className='server-notification'>
        <p>Server notification</p>
      </div>
      <div className='upload-section'>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      </div>
      <div className='container-list-data'>
        <Table columns={columns} dataSource={files} />;
      </div>
    </div>
  )
}

export default App

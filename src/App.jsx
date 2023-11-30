import { useEffect, useState } from 'react'
import './App.css'
import { Table, Select, Input } from 'antd';
import { downloadFile, getListFile, getListIp } from './services';
import UploadFiles from './components/Upload';
import Download from './components/Download';
// import * as _ from 'lodash'
// import { socket } from './socket';
import { Client } from '@stomp/stompjs';

function App() {
  const [files, setFiles] = useState([])
  const [ips, setIps] = useState([])
  const [selectedIp, setSelectedIp] = useState('')
  const [fileName, setFileName] = useState('')
  const [reload, setReload] = useState(false)
  const [message, setMessage] = useState('')
  const { Search } = Input;

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/web-socket'
    });

    client.onConnect = (frame) => {
      // setConnected(true);
      console.log('Connected: ' + frame);
      client.subscribe('/topic/event/file', (greeting) => {
        console.log("greeting", JSON.parse(greeting.body).content)

        setMessage(JSON.parse(greeting.body).content)
        setReload(!reload)
      });
    };
    client.activate();

    return () => {
      client.deactivate();
    }
  }, [])

  useEffect(() => {
    const handler = async () => {
      const data = await getListFile(selectedIp, fileName);
      setFiles(data.data)
    }

    handler()
  }, [reload, selectedIp, fileName])

  useEffect(() => {
    const handler = async () => {
      const data = await getListIp();

      const options = data.data.map(item => {
        return {
          value: item.id,
          label: item.address
        }
      })

      setIps(options)
    }

    handler()
  }, [])

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await downloadFile(fileId)

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a')
      link.href = url;
      link.setAttribute(
        'download',
        fileName,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.log(error)
    }
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
      title: 'Địa chỉ upload',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Số lượt tải xuống',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
    },
    {
      title: 'Tải xuống',
      key: 'download',
      render: (record) => {
        return (
          <Download handleDownload={handleDownload} record={record} />
        )
      }
    },
  ];


  return (
    <div className='container'>
      <div className='server-notification'>
        <p>Server notification</p>
        <span>{message}</span>
      </div>

      <Select
        style={{
          width: 140,
        }}
        placeholder="Ip address"
        onSelect={(value) => setSelectedIp(value)}
        options={ips}
      />
      <Search style={{ width: 160 }} placeholder="Tên file" onSearch={(value) => {
        console.log('value', value)
        setFileName(value)
      }} />

      <UploadFiles afterUpload={() => setReload(!reload)} />

      <div className='container-list-data'>
        <Table scroll={{ y: 450 }} columns={columns} dataSource={files} />
      </div>
    </div>
  )
}

export default App

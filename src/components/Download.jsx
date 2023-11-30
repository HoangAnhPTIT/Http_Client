/* eslint-disable react/prop-types */
import { DownloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'

export default function Download({ record, handleDownload }) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      key={record.id}
      type="primary"
      icon={<DownloadOutlined />} size="small"
      loading={isLoading}
      onClick={() => {
        const aaa = async () => {
          setIsLoading(true)
          await handleDownload(record.id, record.fileName)
          setIsLoading(false)
        }

        aaa()
      }}>
      Download
    </Button>
  )
}

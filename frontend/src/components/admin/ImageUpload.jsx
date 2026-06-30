import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function ImageUpload({ multiple = false, onChange, maxCount = 10 }) {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: list }) => {
    setFileList(list);
    onChange?.(list.map((f) => f.originFileObj).filter(Boolean));
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      multiple={multiple}
      maxCount={multiple ? maxCount : 1}
      beforeUpload={() => false}
      accept="image/*"
    >
      {fileList.length < (multiple ? maxCount : 1) && (
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
}

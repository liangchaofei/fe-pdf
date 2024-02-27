import { Button } from "antd";
import React, { useState, useRef } from "react";
import { toBlob } from "html-to-image";
import { exportPdf } from "@/services";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const componentRef: any = useRef(null);

  // data: base64数据格式
  // filename: 导出文件名
  const exportPdfData = (data: string, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([data], { type: ".pdf" }));
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.setAttribute("download", `${filename}.pdf`);
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const haneldeExport = () => {
    setLoading(true);
    toBlob(componentRef?.current)
      .then((blob: any) => {
        const blobData = new Blob([blob], { type: "image/png" });
        const reader = new FileReader();

        reader.onload = function (event: any) {
          const base64String = event.target.result;
          const filename = "test";
          exportPdf({
            data: base64String,
            filename,
          }).then((res: any) => {
            // 导出pdf
            exportPdfData(res, filename);
            setLoading(false);
          });
        };
        reader.readAsDataURL(blobData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Button onClick={haneldeExport}>导出pdf</Button>

      {/* 要打印的内容 */}
      <div ref={componentRef}>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
      </div>
    </div>
  );
}

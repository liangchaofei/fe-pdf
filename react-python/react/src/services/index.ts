// 服务端接口
export const exportPdf = ({
  data,
  filename,
}: {
  data: any;
  filename: string;
}) => {
  console.log(data, filename);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("base64");
    }, 2000);
  });
};

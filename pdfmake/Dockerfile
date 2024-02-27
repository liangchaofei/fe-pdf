# 使用puppeteer的官方镜像作为基础镜像
FROM shivjm/node-chromium:node18-chromium119-alpine

# 设置工作目录
WORKDIR /app

# 将本地文件拷贝到镜像中
COPY package.json package-lock.json ./
# 安装依赖
RUN npm config set registry https://registry.npmmirror.com
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
RUN npm install
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN apk add wqy-zenhei --update-cache --repository http://nl.alpinelinux.org/alpine/edge/testing --allow-untrusted
# 拷贝应用程序到镜像中
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用程序
CMD ["npm", "start"]
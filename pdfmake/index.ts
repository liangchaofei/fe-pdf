import express from 'express';
import routes from './router';
import cors from 'cors';
import morgan from 'morgan'
import path from 'path'
const app = express();
app.use(morgan('short'));
app.use(cors());
// ...其他的中间件和配置...
app.use(express.json({ limit: "50mb" }));
// 使用pdfRoutes作为路由
app.use('/pdf-api', routes);
app.use('/test.html', (req, res) => {
    const __filename = new URL(import.meta.url).pathname;
    const __dirname = path.dirname(__filename);
    res.sendFile(path.join(__dirname, 'test.html'))
});

// ...其他的路由和配置...

// 启动服务器
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

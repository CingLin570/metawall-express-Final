const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Meta API',
    description: '示範範例生成文件',
  },
  host: 'localhost:3010',
  schemes: ['http', 'https'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'headers',
      name: 'authorization',
      description: '請加上 API Token'
    }
  },
};

const outputFile = './swagger-output.json'; //生成檔案
const endpointsFiles = ['./app.js']; // 讀取路徑

swaggerAutogen(outputFile, endpointsFiles, doc);
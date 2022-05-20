const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'metawall API',
    description: 'metawall API文件',
  },
  host: 'https://secure-plains-31314.herokuapp.com',
  schemes: ['http', 'https'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'headers',
      name: 'authorization',
      description: '請加上 API Token',
    },
  },
  definitions: {
    Posts: {
      $content: '範例資料',
      image: 'https://....',
      likes: 123,
      user: {
        $_id: '123456789',
        name: '小明',
        photo: 'https://....',
      },
      createdAt: '2022-05-03T09:00:00.226Z',
    },
    Users: {
      $name: '小明',
      $email: 'test123@gmail.com',
      photo: 'https://...',
      sex: 'male',
      $password: '12345678',
      createdAt: '2022-05-03T09:00:00.226Z',
    },
  },
};

const outputFile = './swagger-output.json'; //生成檔案
const endpointsFiles = ['./app.js']; // 讀取路徑

swaggerAutogen(outputFile, endpointsFiles, doc);

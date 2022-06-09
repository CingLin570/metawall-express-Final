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
      likes: ['6295818161225bb583801a84'],
      user: {
        $_id: '123456789',
        name: '小明',
        photo: 'https://....',
      },
      comments: '629f3f0c7d5fff79fe6a0bb4',
      createdAt: '2022-05-03T09:00:00.226Z',
    },
    Users: {
      $name: '小明',
      $email: 'test123@gmail.com',
      photo: 'https://...',
      sex: 'male',
      $password: '12345678',
      followers: [
        '6295818161225bb583801a84'
      ],
      following: [
        '6295818161225bb583801a84'
      ],
      createdAt: '2022-05-03T09:00:00.226Z',
    },
    Comments: {
      $comment: '今天天氣真好',
      createdAt: '2022-05-03T09:00:00.226Z',
      $user: '629f425a6b8fdc057104cec2',
      $post: '629eb6d41a7c8d8780b1dbeb'
    }
  },
};

const outputFile = './swagger-output.json'; //生成檔案
const endpointsFiles = ['./app.js']; // 讀取路徑

swaggerAutogen(outputFile, endpointsFiles, doc);

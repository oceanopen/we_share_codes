const path = require('node:path');
const axios = require('axios');
const download = require('download');

const headers = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip',
  'Accept-Language': 'zh-CN,zh;',
  'Cache-Control': 'no-cache',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
};

function sleep(time) {
  return new Promise(reslove => setTimeout(reslove, time));
}
async function load(skip = 0) {
  const data = await axios
    .get('http://service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000000/vertical', {
      headers,
      params: {
        limit: 10, // 每页固定返回 10 条
        skip,
        first: 0,
        order: 'hot',
      },
    })
    .then((res) => {
      return res.data.res.vertical;
    })
    .catch((err) => {
      console.log(err);
    });

  await downloadFile(data);

  await sleep(5000);

  if (skip < 1000) {
    load(skip + 10);
  }
  else {
    console.log('下载完成');
  }
}

async function downloadFile(data) {
  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    // Path at which image will get downloaded
    const filePath = path.reslove(__dirname, '美女');

    await download(item.wp, filePath, {
      filename: `${item.id}.jpeg`,
      headers,
    }).then(() => {
      console.log(`Download ${item.id} Completed`);
    });
  }
}

load();

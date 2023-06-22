var express = require('express');
var router = express.Router();
const redisClientV4 = require('../redis');

async function checkCache(req, res, next){
  let value = await redisClientV4.get(req.query.key); // redis get key 를 한다.
  if (value) {
     // Redis에 저장된 데이터 존재하면 바로 클라이언트에 응답
     res.send(value);
  } else {
     // Redis에 저장된 데이터 없기 때문에 다음 미들웨어 실행
     next();
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', checkCache, async (req, res, next) => {
  try {
    // Redis에서 데이터 가져오기

    
    // const value = await redisClientV4.get(req.query.key);
    // return res.send('Redis 데이터: ' + value);
    // return res.status(200).send('Redis Post Success');

    
    // checkCache 미들웨어 적용 -> redis에서 조회후 없으면 직접 db에서 조회 및 redis에 저장
    // let data = await sequelize.query(`SELECT data FROM tables where id = ${req.query.key}`);
    // await redisCli.set(key, data); // 데이터를 캐시에 저장하고 반환
    return res.send('db select');

  } catch (error) {
    console.log('error: ', error.message);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/test', async (req, res, next) => {

  // await redisClientV4.set('example_key', 'example_value', (err) => {
    
  //   // redisClientV4.expire('example_key', 3600); // 캐싱 기간 설정: 3600초 후에 username 키 삭제
  //   // redisClientV4.setex('example_key', 3600, 'example_value'); // setex 명령어로 키-밸류와 기간을 한번에 지정할 수도 있다

  //   if (err) {
  //     console.error('Redis 데이터 저장 오류:', err);
  //     return res.status(500).send('Internal Server Error');
  //   }

  //   return res.status(200).send('Redis Post Success');

  // });

  try {
    await redisClientV4.set('example_key', 'example_value');
    return res.status(200).send('Redis Post Success');
  
  } catch (error) {
    console.log('error: ', error.message);
    return res.status(500).send('Internal Server Error');
  }

});

router.put('/test', async (req, res, next) => {
  // await redisClientV4.rename('example_key', 'example_value2', (err) => { // value 수정이 아닌 key 수정
  //   if (err) {
  //     console.error('Redis 데이터 수정 오류:', err);
  //     return res.status(500).send('Internal Server Error');
  //   }

  //   return res.status(200).send('Redis Put Success');
  // });

  try {
    await redisClientV4.set('example_key', 'example_key2'); // value 수정이 아닌 key 수정
    return res.status(200).send('Redis Put Success');
  
  } catch (error) {
    console.log('error: ', error.message);
    return res.status(500).send('Internal Server Error');
  }
});

router.delete('/test', async (req, res, next) => {
  const n = await redisClientV4.exists('example_key');
  console.log({n});
  if(n){
    redisClientV4.del('example_key');
  }

  try {
    const n = await redisClientV4.exists('example_key');

    if(n){
      redisClientV4.del('example_key');
    }
    return res.status(200).send('Redis Delete Success');
  
  } catch (error) {
    console.log('error: ', error.message);
    return res.status(500).send('Internal Server Error');
  }
});


// redis cache 활용 전략
// router.get('/book', async (req, res) => {
//   await redisClientV4.get('example_key', req.key, (err, value) => {
//     if (err) {
//       console.error('Redis 데이터 가져오기 오류:', err);
//       return res.status(500).send('Internal Server Error');
//     } else if(value){
//       // 만약 redis(캐시 메모리)에 데이터가 있다면 그대로 반환 → Cache Hit
//       return res.send(value);
//     } else {
//       // 만약 redis(캐시 메모리)에 데이터가 없다면 DB에서 조회 → Cache Miss
      
//       // let data = await sequelize.query('SELECT data FROM tables where id = key');
//       // await redisCli.set(key, data); // 그리고 그 데이터를 캐시에 저장하고 반환
//       return res.send(value);
//     }
//   });
// });

// cache check middleware 적용
// router.get('/book2', checkCache, async (req, res) => {
//   // let data = await sequelize.query(`SELECT data FROM tables where id = ${req.key}`);
//   // await redisCli.set(key, data); // 데이터를 캐시에 저장하고 반환
//   return res.send('db select');
// });

module.exports = router;

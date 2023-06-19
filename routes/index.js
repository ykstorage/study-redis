var express = require('express');
var router = express.Router();
const redisClient = require('../redis');

// router.get('/', async (req, res, next) => {
//   await redisCli.get('username');
// });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', (req, res, next) => {

  // Redis에서 데이터 가져오기
  redisClient.get('example_key', (err, value) => {
    if (err) {
      console.error('Redis 데이터 가져오기 오류:', err);
      return res.status(500).send('Internal Server Error');
    }

    // console.log('Redis에서 가져온 데이터:', value);

    res.send('Redis 데이터: ' + value);
  });
});

// POST
router.post('/set', (req, res, next) => {

  redisClient.set('example_key', 'example_value', (err, reply) => {
    if (err) {
      console.error('Redis 데이터 저장 오류:', err);
      return res.status(500).send('Internal Server Error');
    }

    // console.log('Redis에 데이터 저장 완료:', reply);
  });
});

module.exports = router;

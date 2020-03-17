var router = {};

router.static200 = [
  'somehtml',
  'anotherhtml'
]

router.non200 = {
  '401' : 401,  
  '301': {
    resCode : 301,
    resValue : 'https://URL/'
  }        
}

module.exports = router
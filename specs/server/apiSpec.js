var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var assert = require('assert');

process.env.DATABASE_URL = 'sqlite://test.sqlite';
process.env.TESTING = true;

var app = require('../../server');
var models = require('../../models/index');

var api_request = request.defaults({
  'jar': true,
  'baseUrl': 'http://localhost:3030' 
});

describe('API Integration', function() {
  before(function(done) {
    var server = http.createServer(app);
    app.set('port', 3030);
    server.listen(3030);
    server.on('listening', function() {
      console.log('listening!');
      done();
    })
    server.on('error', function(error) {
      console.error(error);
    })
  });

  describe('database functions', function() {
    console.log('HI');
    before(function(done) {
      models.orm.drop().then(function() {
        console.log('DROP WORKING')
        return models.orm.sync();
      }).then(function() {
        console.log('THEN AFTER DROP')
        return models.User.bulkCreate([{
          username: 'suz',
          coin: 400
        }, {
          username: 'shu',
          coin: 2000
        }]);
      }).then(function() {
        console.log('TheN CREATE CHALLENGE')
        return models.Challenge.create({
          title: 'eat chocolate',
          message: 'have 2 squares a day',
          wager: 200,
          creator: 'suz',
          winner: 'shu',
          complete: true,
          started: 'started',
          total_wager: 400
        })
      }).then(function() {
        done();
      })
    });

    after(function(done) {
      models.orm.drop().then(function() {
        done();
      })
    });

    it('should retrieve values from users table', function(done) {
      console.log('before all=====**********')
      var uri = 'http://localhost:3030/api/1/allUsers';
      request({'uri': uri, 'json': true}, function(err, res, body) {
        console.log('========= user table =========', body);
        expect(body).to.be.an('array');
        expect(body[0].username).to.be.eql('suz');
        expect(body[0]).to.contain.all.keys([
          'username', 'coin', 'id', 'profile_image'
          // 'title', 'message','wager', 'creator', 
          // 'winner', 'complete', 'started', 'total_wager'
        ])
        done();
      })
    }); 
  });

  //   it('should find created challenges', function(done) {
  //     var uri = 'http://localhost:3030/api/1/challenge/public';
  //     request({'uri':uri, 'json': true}, function(err, res, body) {
  //       console.log('======= challenge table ========', body);
  //       expect(body).to.be.an('array');
  //       expect(body[0]).to.be.an('object');
  //       expect(body[0].title).to.be.eql('eat chocolate');
  //       expect(body[0].wager).to.be.eql(200);
  //       expect(body[0].complete).to.be.eql(true);
  //       done();
  //     })
  //   });

  //   it('should correctly send post request to get login user info', function(done) {
  //     var uri = 'http://localhost:3030/api/1/login_user_info';
  //     var res;
  //     request({
  //       uri: uri, 
  //       json: true, 
  //       method: 'POST',
  //       body: {username: 'suz'}
  //     }, function(err, res, body) {
  //       console.log('====== POST loginuserinfo body ======', body);
  //       expect(body).to.be.an('object');
  //       expect(body).to.contain.all.keys([
  //         'username', 'password', 'image', 'coin'
  //       ])
  //       expect(body.coin).to.be.eql(400);
  //       done();
  //     })
  //   })

  //   it('should not allow signup if username already exists', function(done) {

  //     var uri = 'http://localhost:3030/auth/signup';
  //     request({
  //       uri: uri,
  //       json: true,
  //       method: 'POST',
  //       body: {username: 'suz'}
  //     }, function(err, res, body) {
  //       expect(body).to.be.eql('username already exists');
  //       done();
  //     })
  //   })
    
  //   it('should allow for successful signups', function(done) {
  //     var uri = 'http://localhost:3030/auth/signup';
  //     request({
  //       uri: uri,
  //       json: true,
  //       method: 'POST',
  //       body: {username: 'dave'}
  //     }, function(err, res, body) {
  //       console.log('========= successful signup ========', body);
  //       expect(body).to.be.eql('done');
  //       done();
  //     })
  //   })

  // });
});
    // })

    // request({'uri':uri, 'json':true}, function(err, res, body) {
    //     expect(body).to.be.an('object');
    //     expect(body.id).to.eql(1);
    //     expect(body).to.contain.all.keys([
    //       'id', 'title', 'message', 'wager',
    //       'creator', 'started', 'complete', 'winner',
    //       'date_created', 'date_started', 'date_completed',
    //       'participants'
    //     ]);
    //     expect(body.participants).to.be.an('array');
    //     expect(body.participants).to.have.length.above(0);
    //     expect(body.participants[0]).to.contain.keys([
    //       'id', 'first_name', 'last_name', 'accepted'
    //     ]);
    //     done();
    //   });



    // it('should find challenges in db', function() {
    //   var uri = ''
    // })

// })

// describe('Api integration tests', function() {
//   before(function(done) {
//     var server = http.createServer(app);
//     app.set('port', 3030);
//     server.listen(3030);
//     server.on('listening', function() {
//       console.log('Listening on ' + 3030);
//       done();
//     });
//     server.on('error', function(error) {
//       console.error(error);
//     });
//   });

//   describe('Unauthenticated routes', function() {
//     before(function(done) {
//       models.orm.drop().then(function() {return models.orm.sync();}).then(function() {
//         return models.User.bulkCreate([{
//           'id': 1,
//           'first_name': 'Randy',
//           'last_name': 'Savage',
//           'fb_id': '1'
//         }, {
//           'id': 2,
//           'first_name': 'Paul',
//           'last_name': 'Newman',
//           'fb_id': '2'
//         }]);
//       }).then(function() {
//         return models.Challenge.create({'id':1, 'title':'test', 'message':'test', 'creator':1});
//       }).then(function(challenge) {
//         return challenge.addParticipant(1, {'accepted':true});
//       }).then(function() {
//         done();
//       });
//     });

//     after(function(done) {
//       models.orm.drop().then(function() {
//         done();
//       });
//     });

//     it('should retrieve a specific challenge', function(done) {
//       var uri = 'http://localhost:3030/api/1/challenge/1';
//       request({'uri':uri, 'json':true}, function(err, res, body) {
//         expect(body).to.be.an('object');
//         expect(body.id).to.eql(1);
//         expect(body).to.contain.all.keys([
//           'id', 'title', 'message', 'wager',
//           'creator', 'started', 'complete', 'winner',
//           'date_created', 'date_started', 'date_completed',
//           'participants'
//         ]);
//         expect(body.participants).to.be.an('array');
//         expect(body.participants).to.have.length.above(0);
//         expect(body.participants[0]).to.contain.keys([
//           'id', 'first_name', 'last_name', 'accepted'
//         ]);
//         done();
//       });
//     });

//     it('should retrieve a list of public challenges', function(done) {
//       var uri = 'http://localhost:3030/api/1/challenge/public';
//       request({'uri':uri, 'json':true}, function(err, res, body) {
//         expect(body).to.be.an('array');
//         expect(body).to.not.be.empty;
//         expect(body[0].id).to.eql(1);
//         expect(body[0]).to.contain.all.keys([
//           'id', 'title', 'message', 'wager',
//           'creator', 'started', 'complete', 'winner',
//           'date_created', 'date_started', 'date_completed',
//           'participants'
//         ]);
//         expect(body[0].participants).to.be.an('array');
//         expect(body[0].participants).to.have.length.above(0);
//         expect(body[0].participants[0]).to.contain.keys([
//           'id', 'first_name', 'last_name', 'accepted'
//         ]);
//         done();
//       });
//     });
//   });

//   describe('Authenticated routes', function() {
//     before(function(done) {
//       models.orm.drop().then(function() {return models.orm.sync();}).then(function() {
//         return models.User.bulkCreate([{
//           'id': 1,
//           'first_name': 'Randy',
//           'last_name': 'Savage',
//           'fb_id': '1'
//         }, {
//           'id': 2,
//           'first_name': 'Paul',
//           'last_name': 'Newman',
//           'fb_id': '2'
//         }]);
//       }).then(function() {
//         api_request({'uri': '/auth/login'}, function(err, res, body) {
//           done();
//         });
//       });
//     });

//     after(function(done) {
//       models.orm.drop().then(function() {
//         done();
//       });
//     });

//     it('should be able to retrieve user info', function(done) {
//       var uri = '/api/1/user_info';

//       api_request({'uri':uri, 'json':true}, function(err, res, body) {
//         expect(body).to.contain.all.keys(['id', 'first_name', 'last_name', 'email', 'profile_image']);
//         done();
//       });
//     });

//     it('should be able to create a new challenge', function(done) {
//       var uri = '/api/1/challenge';
//       var data = {
//         'title': 'There is text here',
//         'message': 'Here as well',
//         'participants': [2]
//       };

//       api_request({'uri':uri, 'method':'POST', 'json':data}, function(err, res, body) {
//         expect(body).to.be.an('object');
//         expect(body).to.contain.key('id');
//         expect(body.id).to.be.a('number');
//         done();
//       });
//     });

//     it('should be able to retrieve a list of challenges associated with currently logged in user', function(done) {
//       var uri = '/api/1/challenge/user';

//       api_request({'uri':uri, 'json':true}, function(err, res, body) {
//         expect(body).to.be.an('array');
//         expect(body).to.not.be.empty;
//         expect(body[0].id).to.eql(1);
//         expect(body[0]).to.contain.all.keys([
//           'id', 'title', 'message', 'wager',
//           'creator', 'started', 'complete', 'winner',
//           'date_created', 'date_started', 'date_completed',
//           'participants'
//         ]);
//         expect(body[0].participants).to.be.an('array');
//         expect(body[0].participants).to.have.length.above(0);
//         expect(body[0].participants[0]).to.contain.keys([
//           'id', 'first_name', 'last_name', 'accepted'
//         ]);
//         done();
//       });
//     });

//     it('should be able to start a challenge', function(done) {
//       var query = {
//         'where': {
//           'challengeId': 1,
//           'userId': 2
//         }
//       };
//       models.UserChallenge.update({'accepted': true}, query).then(function() {
//         var uri = '/api/1/challenge/1/started';

//         api_request({'uri':uri, 'method':'PUT', 'json':true}, function(err, res, body) {
//           expect(body).to.be.an('object');
//           expect(body.success).to.be.true;
//           done();
//         });
//       });
//     });

//     it('shouldn\'t be able to start a challenge that has already been started', function(done) {
//       var uri = '/api/1/challenge/1/started';

//       api_request({'uri':uri, 'method':'PUT', 'json':true}, function(err, res, body) {
//         expect(res.statusCode).to.eql(400);
//         expect(body).to.be.an('object');
//         expect(body).to.have.all.keys(['error', 'message']);
//         done();
//       });
//     });
  
//     it('should be able to complete a challenge', function(done) {
//       var uri = '/api/1/challenge/1/complete';
//       var data = {'winner': 1};

//       api_request({'uri':uri, 'method':'PUT', 'json':data}, function(err, res, body) {
//         expect(body).to.be.an('object');
//         expect(body.success).to.be.true;
//         done();
//       });
//     });

//     it('shouldn\'t be able to complete a challenge that has already been completed', function(done) {
//       var uri = '/api/1/challenge/1/complete';
//       var data = {'winner': 1};

//       api_request({'uri':uri, 'method':'PUT', 'json':data}, function(err, res, body) {
//         expect(res.statusCode).to.eql(400);
//         expect(body).to.be.an('object');
//         expect(body).to.have.all.keys(['error', 'message']);
//         done();
//       });
//     });

//     xit('should be able to accept a challenge', function(done) {
//       var uri = 'http://localhost:3030/api/1/challenge/3/accept';

//       request({'uri':uri, 'method':'PUT', 'json':true}, function(err, res, body) {
//         expect(body).to.be.an('object');
//         expect(body.success).to.be.true;
//         done();
//       });
//     });

//     xit('shouldn\'t be able to accept a challenge that has already been accepted', function(done) {
//       var uri = 'http://localhost:3030/api/1/challenge/2/accept';

//       request({'uri':uri, 'method':'PUT', 'json':true}, function(err, res, body) {
//         expect(body).to.be.an('object');
//         expect(body).to.have.all.keys(['error', 'message']);
//         done();
//       });
//     });

//   });

// });

// describe('Api unit tests', function() {
//   it('should validate challenge creation form', function() {
//     var challenge_form_is_valid = require('../../routes/api').challenge_form_is_valid;

//     var valid_form = {
//       'title': 'There is text here',
//       'message': 'Here as well'
//     };
//     var invalid_form = {
//       'title': '',
//       'message': ''
//     };
//     var mixed_form = {
//       'title': 'There is text here',
//       'message': ''
//     };
//     var under_min_length = {
//       'title': 'hi',
//       'message': 'There is text here'
//     };

//     var expected_results = [true, false, false, false];

//     [valid_form, invalid_form, mixed_form, under_min_length].forEach(function(form, i) {
//       expect(challenge_form_is_valid(form)).to.eql(expected_results[i]);
//     });

//   });
// });

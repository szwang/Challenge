var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://ChallengeDb.sqlite');

orm.authenticate()
  // .then(function() {
  //   console.log('Connection to db successful!');
  //  })
  .catch(function(err) {
    console.log('Connection to db failed: ', err);
  })
  .done();

var User = orm.define('users', {
  first_name: {
    type: Sequelize.STRING
  },

  last_name: {
    type: Sequelize.STRING
  },

  email: {
    type: Sequelize.STRING
  },

  fb_id: {
    type: Sequelize.STRING
  },

  profile_image: {
    type: Sequelize.STRING,
    defaultValue: '/img/placeholder.jpg'
  }
});

var Challenge = orm.define('challenges', {
  // Decided this was not needed, just using the 'id' on Challenge
  // url_id: {
  //   type: Sequelize.INTEGER,
  //   autoincrement: true
  // },

  title: {
    type: Sequelize.STRING, allowNull: false
  },

  message: {
    type: Sequelize.STRING, allowNull: false
  },

  wager: {
    type: Sequelize.STRING
  },

  creator: {
    type: Sequelize.INTEGER, allowNull: false
  },

  winner: {
    type: Sequelize.INTEGER, defaultValue: 0
  },

  complete: {
    type: Sequelize.BOOLEAN, defaultValue: false
  },

  started: {
    type: Sequelize.BOOLEAN, defaultValue: false
  },

  // sequelize or sqlite automatically makes a 'createdAt' attribute
  // create_date: {

  // },

  date_started: {
    type: Sequelize.DATE
  },

  date_completed: {
    type: Sequelize.DATE
  }
});

// Define the join table which joins Users and Challenges
var UserChallenge = orm.define('usersChallenges', {
  accepted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  upvote: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

// Setup the many-many relationship through the orm
User.belongsToMany(Challenge, {
  through: UserChallenge
});

Challenge.belongsToMany(User, {
  through: UserChallenge,
  as: 'participants'
});

var Comment = orm.define('comments', {
  text: {
    type: Sequelize.STRING(512)
  }
});

Comment.belongsTo(Challenge);
Comment.belongsTo(User);


// make the database
// delete database file to clear database
orm.sync();

exports.User = User;
exports.Challenge = Challenge;
exports.UserChallenge = UserChallenge;
exports.Comment = Comment;
exports.orm = orm;

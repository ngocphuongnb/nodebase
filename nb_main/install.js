/***** add db user *****/
//use admin
db.createUser({user:"nodeblog_user",pwd:"123456789", roles:[{role:"root",db:"admin"}]})
//use nodeblog
db.createUser(
    {
        user: "nodeblog_user",
        pwd: "123456789",
        roles: [ { role: "readWrite", db: "nodeblog" } ]
    }
);



/***** Or *****/
//use nodeblog
db.createUser(
    {
        user: "nodeblog_user",
        pwd: "123456789",
        roles: [ { role: "readWrite", db: "nodeblog" } ]
    }
);


/***** add admin user *****/

var userBase = require(path.join(LIBS_DIR, 'user'))({});
userBase.addUser({
    username: 	'ngocphuongnb',
    email: 		'nguyenngocphuongnb@gmail.com',
    password: 	'',
    level: 		USER_LEVEL.ADMINISTRATOR,
    status: 	'active'
}, function(err, msg, user) {
    
});
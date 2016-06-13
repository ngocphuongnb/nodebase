module.exports = function(str) {
	return function expressPoweredBy(req, res, next) {
		res.setHeader('X-Powered-By', str);
		next();
	};
};
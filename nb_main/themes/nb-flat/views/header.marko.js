function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      lasso_head = __loadTag(require("lasso/taglib/head-tag"));

  return function render(data, out) {
    out.w("<head> <title>Nodeblog Dashboard</title> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> ");

    lasso_head({}, out);

    out.w(" </head>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);

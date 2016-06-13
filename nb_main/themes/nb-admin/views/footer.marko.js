function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      lasso_body = __loadTag(require("lasso/taglib/body-tag"));

  return function render(data, out) {
    lasso_body({}, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);

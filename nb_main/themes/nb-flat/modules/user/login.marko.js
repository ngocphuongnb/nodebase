function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      lasso_page = __loadTag(require("lasso/taglib/page-tag")),
      lasso_head = __loadTag(require("lasso/taglib/head-tag")),
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa,
      lasso_body = __loadTag(require("lasso/taglib/body-tag"));

  return function render(data, out) {
    lasso_page({
        dependencies: data.dependencies,
        dirname: __dirname,
        filename: __filename
      }, out);

    out.w("<!DOCTYPE html> <html lang=\"en\"> <head> <title>Nodeblog login</title> ");

    lasso_head({}, out);

    out.w(" </head> <body> <div class=\"login-content clear\"> <div class=\"container\"> <div class=\"row\" id=\"login-container\"> ");

    if (notEmpty(data.msg)) {
      out.w("<ul class=\"alert-container\"> ");

      forEach(data.msg, function(m) {
        out.w("<li class=\"alert alert-" +
          escapeXmlAttr(m.type) +
          "\"> " +
          escapeXml(m.content) +
          " </li>");
      });

      out.w(" </ul>");
    }

    out.w(" <form class=\"col s12\" method=\"post\"> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"username\" type=\"text\" name=\"username\"> <label for=\"username\">Username</label> </div> </div> <div class=\"row\"> <div class=\"input-field col s12\"> <input id=\"password\" type=\"password\" name=\"password\" class=\"validate\"> <label for=\"password\">Password</label> </div> </div> <div class=\"row\" style=\"text-align: center\"> <button class=\"btn waves-effect waves-light\" type=\"submit\" name=\"action\">Login</button> </div> </form> </div> </div> <div class=\"login-actions\"> <a href=\"#\"><i class=\"zmdi zmdi-plus\"></i> <span>Register</span></a> <a href=\"#\"><i>?</i> <span>Forgot Password</span></a> </div> </div> ");

    lasso_body({}, out);

    out.w(" </body> </html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);

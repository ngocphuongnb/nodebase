Express Powered By
==================

Set the X-Powered-By header returned by Express

----

Installation

````bash
npm install express-powered-by
````

Usage:

````javascript
// Accepts a single argument, a string to use for the X-Powered-By header
app.use(require('express-powered-by')('Foo'));
````
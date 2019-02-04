const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();

const staticFileMiddleware = express.static(__dirname + '/build');
app.use(staticFileMiddleware);
app.use(history({
  disableDotRule: true
}));
app.use(staticFileMiddleware);

const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
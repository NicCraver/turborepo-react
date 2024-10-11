const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { responseHandler } = require('./responseWrapper');

const app = new Koa();

const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(bodyParser());
app.use(responseHandler);
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

const PORT = 3099;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
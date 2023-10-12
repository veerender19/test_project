const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const timeout = require("connect-timeout");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
require('dotenv').config();
const connection = require("./config/database");
const app = express();

app.use(timeout("30s"));
app.use(helmet());
if (process.env.production == true) {
  const whitelist = ['http://localhost']
  const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback({ err: new Error('Not allowed for you') })
      }
    }
  }
  app.use(cors(corsOptions));
  }
  else {
  app.use(cors());
  }
app.use(haltOnTimedout);
// Body Parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(passport.initialize());
require("./config/passport")(passport);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
const apiRoutes = require("./routes/api");
app.use("/", apiRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Default Route
app.use("/", (req, res) => {
  res.json({ welcome: "Welcome in test-project app" });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(500).render('error', { error: err });
});
if (process.env.production == true) {

}
else {
  const server = require("http").createServer(app);
  server.listen(process.env.PORT, (_) => console.log(`Server listening at port ${process.env.PORT}`));

}
module.exports = app;

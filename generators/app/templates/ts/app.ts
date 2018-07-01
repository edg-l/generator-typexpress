import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import path from "path";
<% if (props.mongoose) { %>import mongoose from "mongoose";<% } %>
<% if (props.session) { %>import session from "express-session";<% } %>
<% if (props.session && props.mongoose) { %>import connectMongo from "connect-mongo";<% } %>
<% if (props.css == "styl") { %>import stylus from "stylus";
<% } else if (props.css == "less") { %>import lessMiddleware from "less-middleware";
<% } else if (props.css == "sass") { %>import sassMiddleware from "node-sass-middleware";
<% } %>
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

<% if (props.session && props.mongoose) { %>const MongoStore = connectMongo(session);<% } %>

const app: express.Express = express();
export default app;

<% if (props.mongoose) { %>
mongoose.connect("mongodb://localhost/mynewapp", {
  keepAlive: 120,
  config: {
    autoIndex: false,
  },
});<% } %>

<% if (props.session) { %>const sessOptions: any = {
  secret: "change_me_please",
  name: "<%= props.name %>",
  cookie: {
    maxAge: 1000 * 60 * 60 * 60 * 24 * 14,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  <% if (props.mongoose) { %>store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),<% } %>
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessOptions.cookie.secure = true; // serve secure cookies
}
app.use(session(sessOptions));<% } %>

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "<%= props.engine %>");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
<% if(props.css === "styl") { %>app.use(stylus.middleware(path.join(__dirname, "../public")));
<% } else if(props.css === "less") { %>app.use(lessMiddleware(path.join(__dirname, "../public")));
<% } else if(props.css === "sass") { %>app.use(sassMiddleware({
  src: path.join(__dirname, "../public"),
  dest: path.join(__dirname, "../public"),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));<% } %>
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler.
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, onlyp roviding error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

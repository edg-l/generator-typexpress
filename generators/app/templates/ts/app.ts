import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import logger from "morgan";
import path from "path";
<% if (props.css == "styl") { %>import stylus from "stylus";
<% } else if (props.css == "less") { %>import lessMiddleware from "less-middleware";
<% } else if (props.css == "sass") { %>import sassMiddleware from "node-sass-middleware";
<% } %>
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app: express.Express = express();
export default app;

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

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import expressSession from 'express-session';
import logger from 'morgan';
import path from 'path';
import passport from 'passport';
import pLocal from 'passport-local';  // this is a strategy for username/password authentication
import flash from 'connect-flash';
import sassMiddleware from 'node-sass-middleware';
import index from './routes/index';
import usersRouter from './routes/user';

const app = express();
const debug = Debug('desc-task:app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
app.use (expressSession ({secret: 'winteriscoming', resave: false, saveUninitialized: true, cookie: {maxAge: 1000000000000}}));

app.use (flash());
app.use (passport.initialize ());
app.use (passport.session ());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use ('/user', usersRouter);

app.get ('/dashboard', (req, res) => {
	res.send ({status: 'error', message: 'this is dashboard'});
});
app.get ('/', (req, res) => {
	res.send ({status: 'error', message:'this is error page'});
});


export default app;

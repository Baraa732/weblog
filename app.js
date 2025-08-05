require('dotenv').config()
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./server/config/db.js')
const postsRouter = require('./server/routes/main.js')
// const { isActiveRoute } = require('./server/helpers/routeHelpers.js')
const app = express()
const PORT = 5000 || process.env.PORT;

// connect to db
connectDB();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true,
   store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL
   }),
   // cookie: { mxAge: new Date(Date.now() + (3600000) ) }
}))

app.use((req, res, next) => {
   res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
   next();
});


// api requests ( postman )
app.use('/api/posts', postsRouter);
app.use(express.static('public'))


// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main.js'))
app.use('/', require('./server/routes/admin.js'))


app.listen(PORT, () => {
   console.log(`App Listening on port http://localhost:${PORT}/home`)
})


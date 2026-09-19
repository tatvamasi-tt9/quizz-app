const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();


app.use(cookieParser()); // MUST be before routes
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173", // EXACT frontend URL
  credentials: true               //  allow cookies
}));


//db connect AFTER dotenv
require('./Models/db');

const Result=require('./Routes/Resultrouter')
const History=require('./Routes/historyrouter')
const Authrouter = require('./Routes/authrouter');
const geminiroute=require('./Routes/geminirouter')
const pdfRouter = require("./Routes/pdfRouter");
const imageRouter = require("./Routes/imageRouter");
const Linkrouter = require("./Routes/Linkrouter");
const fetchquestionRouter=require('./Routes/fetchQuestion')
const PORT = process.env.PORT || 8080;


app.use('/login', Result);
app.use('/login', History);

app.get('/auth/verify', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      authenticated: true,
      user: decoded
    });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
});

app.use('/auth', Authrouter);
app.use('/', geminiroute);
app.use("/", pdfRouter);

app.use("/", imageRouter);
app.use("/",Linkrouter);
app.use('/',fetchquestionRouter)


app.listen(PORT, () => {
  console.log('server is running');
});

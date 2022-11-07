var express = require("express");
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
const uuid = require("uuidv4");
const crypto = require("crypto");
var mysql = require("mysql");
var cors = require("cors");
const { query } = require("express");

var app = express();

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(
  bodyParser.json({
    type: "application/vnd.api+json",
  })
);

var con = mysql.createConnection({
  host: "localhost",
  database: "mydb",
  user: "root",
  password: "admin",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(cors());
app.options("*", cors());

app.set("port", process.env.PORT || 3000);
console.log("hello");

var server = http.createServer(app);

server.listen(app.get("port"), "0.0.0.0", function () {
  console.log("express server listening on port " + app.get("port"));
});

app.set("views", __dirname + "/public");
app.use(express.static(path.join(__dirname, "public")));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/login", function (req, res) {
  res.render(__dirname + "/pages/login.html");
});

app.get("/register", function (req, res) {
  res.render(__dirname + "/pages/registration.html");
});

app.get("/home", function (req, res) {
  res.render(__dirname + "/pages/home.html");
});

app.get("/page2", function (req, res) {
  res.render(__dirname + "/pages/page2.html");
});

//***register API***/

app.post("/addUsers", (req, res) => {
  // console.log(req)
  let userName = req.body.Username;
  let userEmail = req.body.Email;
  let userPassword = req.body.Password;
  let userOtp = Math.floor(Math.random() * 1000000).toString();

  con.query(
    "SELECT * FROM user_details WHERE user_email = '" + userEmail + "'",
    function (err, result, fields) {
      if (err) {
        throw err;
      }
      console.log(result);

      if (result.length == 0) {
        let id = crypto.randomBytes(20).toString("hex");
        // console.log(id);
        let user_id = uuid.fromString(id);
        // console.log(user_id);

        let today = new Date();
        let currrentTime = today.toISOString();
        // console.log(currrentTime);

        var sql =
          "INSERT INTO user_details (user_id, user_name, user_email, user_password, user_otp, created_ts, updated_ts) VALUES ('" +
          user_id +
          "','" +
          userName +
          "','" +
          userEmail +
          "','" +
          userPassword +
          "','" +
          userOtp +
          "','" +
          currrentTime +
          "','" +
          currrentTime +
          "')";

        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            // console.log(result);
            console.log("1 record inserted");
            res.send({ uid: user_id });
            // res.sendStatus(200)
          }
        });
      }
    }
  );
});

app.post("/genotp", (req, res) => {
  let iotp = req.body.gotp;
  let sid = req.body.sid;
  console.log(iotp, sid);
  con.query(
    "SELECT user_otp FROM user_details WHERE user_id = '" + sid + "'",
    function (err, result, fields) {
      console.log(result);
      if (err) {
        throw err;
      } else {
          if(iotp==result[0].user_otp){
            res.sendStatus(200)         
          }else{
            res.sendStatus(501)
          }
      }
    }
  );
});

//***register API***/


//***login API***/


app.post("/users", (req, res) => {
  let userEmail = req.body.Email;
  let userPassword = req.body.Password;

  con.query("select * from user_details  WHERE user_email = '" + userEmail + "'", function (err, result){
    if (err) {throw err
        }else{
          if (result.length==1){
            let userOtp = Math.floor(Math.random() * 1000000).toString();
            con.query("UPDATE user_details SET user_otp = '" + userOtp + "' WHERE user_email = '" + userEmail + "'", function (err, result) {
              console.log(userOtp);
              if (err) {throw err}
            })
          }else{
            res.sendStatus(500)
          }
        }}
  )
})


app.post("/logotp", (req, res) => {
  let iotp = req.body.gotp;
  let userEmail = req.body.email;
  console.log(iotp, userEmail);
  con.query(
    "SELECT user_otp FROM user_details WHERE user_email = '" + userEmail + "'",
    function (err, result, fields) {
      console.log(result);
      if (err) {
        throw err;
      } else {
          if(iotp==result[0].user_otp){
            let sessionid = crypto.randomBytes(20).toString("hex");
            let user_session = uuid.fromString(sessionid);
            
            con.query("UPDATE user_details SET user_session = '" + user_session + "' WHERE user_email = '" + userEmail + "'", function (err, result) {
              console.log(result);
              if (err) {throw err
              }else{
                res.send({usersess: user_session})
              }
            })
          }
      }
    }
  );
});

app.post("/submit", (req, res) => {
  let userid = req.body.user;
  let usersess = req.body.sessid;

    con.query(
      "SELECT user_id FROM user_details WHERE user_session = '" + usersess + "'",
      function (err, result, fields) {
        console.log(result);
        if (err) {
          throw err;
        }else{
          res.send({userid: result[0].user_id})
        } 
      })
  })



app.post("/page", (req, res) => {
let userid = req.body.user;
  con.query(
    "SELECT user_name FROM user_details WHERE user_id = '" + userid + "'",
    function (err, result, fields) {
      console.log(result);
      if (err) {
        throw err;
      }else{
        res.send({name: result[0].user_name})
      } 
    })
})



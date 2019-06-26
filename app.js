var express = require('express')
  , routes = express.Router()
  , http = require('http')
  , path = require('path')
  , app = express()
  , multer = require('multer')
  , mysql      = require('mysql')
  , bodyParser=require("body-parser");
  
const DIR = './uploads';

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'shivam',
  password : '',
  database : 'colt'
});
app.use(express.static(__dirname + "/"));
connection.connect();
 
global.db = connection;
 
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DIR);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({storage: storage});

// all environments
const PORT = process.env.PORT || 8010;
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
message="";
app.get("/",(req,res)=>{
res.render("index",message)
})
 app.listen(PORT, function () {
  console.log('Node.js server is running on port ' + PORT);
});
app.post('/api/v1/upload',upload.single('profile'), function (req, res) {
    message : "Error! in image upload."
      if (!req.file) {
          console.log("No file received");
            message = "Error! in image upload."
          res.render('index',{message: message, status:'danger'});
      
        } else {
          console.log('file received');
          console.log(req);
          var sql = "INSERT INTO `file`(`name`, `type`, `path`) VALUES ('" + req.file.filename + "', '"+req.file.mimetype+"', '"+req.file.path+"')";
  
                  var query = db.query(sql, function(err, result) {
                     console.log('inserted data');
                  });
          message = "Successfully! uploaded";
          res.render('index',{message: message, status:'success'});
  
        }
  });
  app.get('/pic',(req,res)=>{
    var q = 'SELECT path FROM file';
    
    connection.query(q, function (error, results) {
    if (error) throw error;
    var msg = "We have " + results + " users";
    // res.send(msg);
res.render("base.ejs",{p:results[1].path})
console.log()
    })
  })
//Middleware
app.listen(8080)

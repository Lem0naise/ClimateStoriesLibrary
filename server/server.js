const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql')
let bodyParser = require('body-parser');
const { fileURLToPath } = require('url');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))

const config = {
  user: "climates",
  password: "kryLemonaise2705!", 
  server: 'localhost',
  port: 3306,
  database: "climates_stories",
  authentication: {
    type: 'default'
  },
  options : {
    encrypt: true
  }
}

//CORS middleware
let corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'localhost'); //replace localhost with actual host
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
  next();
}

app.use(corsMiddleware);
app.use(bodyParser.json());


app.get('/' , async function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
    return;
})

app.get('/admin' , async function(req, res) {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
  try {
  }
  catch (err){
    console.error(err.message);
  }
  return;
})

let hashed_user = "P011511210110110011910110810801151121011011001191011081084849494849494848494957494849494856494856";
let hashed_pass = "P07797114116105110103971081011154950515233077971141161051101039710810111549505152334948494851575549485649484949495352575348534953505151";
async function hashPass(toHash){
  let hash = 50; // length
  let hashed = "P";
  while (hashed.length < hash)
  { 
    let conc = 0;
    for (let i=0;i<(toHash.length + hashed.length);i++){
      try{conc += toHash[i].charCodeAt(0).toString()}
      catch{
          try{conc += hashed[i].charCodeAt(0).toString()}
      catch{}} 
    }
    hashed = hashed.concat(conc)
  }
  return hashed;
}

app.get('/login', async function(req, res) {
  let formData = req.body;

  let username = formData['username']
  let password = formData['password']
  console.log("Admin login attempted with username", username)

  if (await hashPass(username)==hashed_user && await hashPass(password)==hashed_pass){
    //res.writeHead(200, { 'Content-Type': 'application/json' });
    //res.end(JSON.stringify({ message: 'Authorised'}));
    //console.log("Admin login authorised.")
    
    let poolConnection = mysql.createConnection({
      host:"localhost",
      user:"climates",
      password:"kryLemonaise2705!"
    });
    poolConnection.connect(function(err){
      if (err) throw err;
      console.log("Connected!");
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Authorised', body:'SQL Connected'}));
      console.log("Admin login authorised, SQL connected")
    })
    // list of formData requests (TODO)
    if (formData['selector'] == 'custom') { // custom sql
      let customQuery = formData['custom-query'];
    }
  }
  else { // incorrect password
    setTimeout(function(){
      console.log("Admin login denied.")
      console.log(hashPass(username))
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid username or password, try again.'}))
    }, 500)
    }
  return 1;
})

app.post('/customSQL', async function(req, res) {
  let customSql = req.body['custom-sql']
  let loggedIn = true;
  if (loggedIn){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Authorised'}));
  }
  else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not logged in.' }));
  }
  return 1;
})

app.get('/aboutus' , async function(req, res) {
    res.sendFile(path.join(__dirname, 'public/aboutus.html'));
    try {
      // connecting on start
      /*
      if (!connected){
        console.log("Connecting to the table initially...");
        poolConnection = await sql.connect(config);
        connected = true;
        console.log("Connected, " + poolConnection)
      }
      else{
        console.log("Already connected.")
      }
        */
    }
    catch (err){
      console.error(err.message);
    }
    return;
})
app.get('/share' , async function(req, res) {
  res.sendFile(path.join(__dirname, 'public/share.html'));
  try {
    // connecting on start
    /*
    if (!connected){
      console.log("Connecting to the table initially...");
      poolConnection = await sql.connect(config);
      connected = true;
      console.log("Connected, " + poolConnection)
    }
    else{
      console.log("Already connected.")
    }
      */
  }
  catch (err){
    console.error(err.message);
  }
  return;
})
app.get('/stories' , async function(req, res) {
  res.sendFile(path.join(__dirname, 'public/stories.html'));
  try {
    // connecting on start
    /*
    if (!connected){
      console.log("Connecting to the table initially...");
      poolConnection = await sql.connect(config);
      connected = true;
      console.log("Connected, " + poolConnection)
    }
    else{
      console.log("Already connected.")
    }
      */
  }
  catch (err){
    console.error(err.message);
  }
  return;
})


app.post('/sqlquery', async function(req, res){
  console.log(req.body.query)
  if (connected){
    /*
    try{
      resultSet = await poolConnection.request().query(req.body.query);
      console.log(resultSet)
      res.redirect('back');
      return;
    }
    catch {
      console.log("Invalid SQL Query.")
      res.redirect('back');
      return;
    }
      */
  }

})

let connected = false;
app.get('/status', async function(req, res){
  if (!connected){
    /*
    connected = true;
    console.log("Connecting on status press...")
    poolConnection = await sql.connect(config);
    console.log("Connected");
    */
  }
  else {
    /*
    connected = false;
    console.log("Closing connection on status press ...")
    poolConnection.close()
    console.log("Disconnected.");
    */
  }
  res.send(connected);
  return(connected);
})


app.get('/getstatus', async function(req, res){
    /*
  if (poolConnection){
    console.log(poolConnection._connected);
    res.send(poolConnection._connected);
    return(poolConnection._connected);
  }
  else {
    res.send(false);
    return(false);
  }
    */
   return(false);

})

app.post('/delete', async function(req, res){
  console.log("Connecting to the table...");
  try {
    let d= req.body['Data']
    console.log(d);
    d[2] = services[d[2]] // services transcribing
    
    resultSet = await poolConnection.request().query(`
    DELETE FROM CLIENTS WHERE company='${d[0]}' and name='${d[1]}' and service='${d[2]}'`);
    console.log("Deleted " + d[0])
    res.sendStatus(200);
    return;
  }
  catch(err){
    console.log(err);
    console.log("Not connected. Now connecting... (not anymore)")
    res.sendStatus(500);
    return;
  }
})

app.post('/new', async function(req, res){
  //poolConnection = await sql.connect(config);
  console.log("Connecting to the table...");
  try {
    console.log(req.body.company, req.body.name, req.body.service)
    resultSet = await poolConnection.request().query(`INSERT INTO 
        CLIENTS (company, name, service, loc) 
        VALUES (
          '${req.body.company}',
          '${req.body.name}',
          '${req.body.service}',
          '${req.body.loc}');`);
    res.redirect('back');
    return;
  }
  catch{
    console.log("Not connected. Now connecting... (not anymore)")
    res.sendStatus(500);
    return;
    /*
    try {
      // connecting on start
      console.log("Connecting to the table...");
      poolConnection = await sql.connect(config);

      console.log("Connected, " + poolConnection)
    }
    catch (err){
      console.error(err.message);
    }
    
    */
  }
 
})

app.post('/map', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send('api');
});

app.get('/clients', async function(req, res){

    try {
      console.log("Querying for clients...");
      let resultSet = await poolConnection.request().query(`SELECT * FROM CLIENTS`);
      console.log(resultSet)
      res.send(resultSet);
      /*
      let resultSet = await poolConnection.request().query(`CREATE TABLE CLIENTS (
        company VARCHAR(80),
        name VARCHAR(60),
        service VARCHAR(60)
      )`);
      */
      //console.log(`${resultSet.recordset.length} rows returned.`)
      //let columns = "";
      //for (let column in resultSet.recordset.columns) {
      //  columns += column + ', ';
     //}
      //resultSet.recordset.forEach(row => {
      //  console.log("%s\t%s", row.CategoryName, row.ProductName);
      //});


      /* READING ROWS
      console.log("Reading rows from the table...");
      let resultSet = await poolConnection.request().query(`SELECT *`);
      console.log(`${resultSet.recordset.length} rows returned.`)
      let columns = "";
      for (let column in resultSet.recordset.columns) {
        columns += column + ', ';
      }
      resultSet.recordset.forEach(row => {
        console.log("%s\t%s", row.CategoryName, row.ProductName);
      });

      */
    }
    catch (err){
      console.error(err.message);
    }
    
    /*
   async function asyncFunction() {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT 1 as val");
      console.log(rows); //[ {val: 1}, meta: ... ]
      //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
      console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
    
  }*/
})


let server = app.listen(8080, function() {
  console.log('Site running at port 8080...')
})

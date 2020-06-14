const http = require("http");
const express = require('express') //importacao do pacote
const app = express() //instanciando express
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { send } = require("process");
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var baseRestURL = "";
var username = "";
var password = "";
var respostaConsultaImovelLink;
var ress;
var nomeCidadeGlobal;
var nomeBairroGlobal;
var idCidadeGlobal;
var infoProduto;
var errGlobal;
var link;






// Inicio
app.get('/boletonossonumero', function (req, res) {
  var cpfcnpj = req.query.cpfcnpj;
  //var nossonumero = req.query.nossonumero;
  this.username = req.query.user;
  this.password = req.query.key;
  this.baseRestURL = "http://api.brognoli.com.br:8080/api/v2/boletos/" + cpfcnpj + "/"  + "pdf";
  createAuthToken(this.baseRestURL, this.username, this.password, function authCallBack(token) {
    res.send("https://drive.google.com/open?id=1hcB664RAvSFU4qQuXsozqTrs0rFoYjCE");
    return "https://drive.google.com/open?id=1hcB664RAvSFU4qQuXsozqTrs0rFoYjCE";
    
  });

})
http.createServer(app).listen(3002, () => console.log("Servidor rodando local na porta 3002"));

// Autenticação e tratamento do imovel
function createAuthToken(baseRestURL, username, password, callback) {
  var APIPath = "";
  var completeRestURL = baseRestURL + APIPath;
  var method = "GET";
  var postData = "{\"username\": \"" + username + "\",\"password\": \"" + password + "\",\"loginMode\": 1,\"applicationType\": 35}";
  var url = completeRestURL;
  var async = true;
  var request = new XMLHttpRequest();
  
  request.onload = function () {
    var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
    console.log(status);
    var token = request.getResponseHeader("x-mstr-authtoken");
    this.ress = this.responseText;
    runPopularCidades(this.ress, function runPopularCidades() {
    });
    apigoogledrive(this.ress, function apigoogledrive() {

    });
    return callback(token);
  }

  request.open(method, url, async);
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("user", this.username);
  request.setRequestHeader("key", this.password);
  request.send(postData);
  console.log(request.statusText);

}

function runPopularCidades(respostaConsultaImovelLink) {
  var respostaConsultaImovelLink = JSON.parse(respostaConsultaImovelLink)
 console.log(respostaConsultaImovelLink);
  return "";
}

function apigoogledrive() {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles);
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  var fileMetadata = {
    'name': 'arquivo3.jpeg'
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('arquivo3.jpeg')
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
      this.errGlobal = err;
    } else {
      console.log('File Id: ', file.data.id);
      this.link = file.data.id;
    }
  });
}


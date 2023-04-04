
var admin = require("firebase-admin");
const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const hostname = '127.0.0.1'

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))



var serviceAccount = require("./aglsistem-71590-firebase-adminsdk-olxun-4ab4622e07.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aglsistem-71590-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

app.post('/', async (req, res) => {
  const dosyacik = req.body.dosyayoluu
  const istayonname = req.body.istasyonname2

  const dosyalar = fs.readdirSync(dosyacik)

  for (const dosya of dosyalar) {
    console.log('başladı')
    let x = 60;
    let lines = []
    try {
      const dosyaYol = path.join(dosyacik, dosya)
      const veri = fs.readFileSync(dosyaYol)
      let tarih = dosya.replace('.LOG', '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
      tarih = tarih.replace('.log', '')
      lines = veri.toString().split('\n')
      console.log(lines)
      for (let i = 0; i < lines.length; i++) {
        const forEachveri = lines[i].replace(/\r/g, '')
       
        if (forEachveri != '') {
         
          if (i == x) {
            x += 60;
          let date = forEachveri.slice(0, 8)
          let veri = forEachveri.slice(11, 18)
          let newveri = parseInt(veri, 10)
          const Date = date.replace(/:/g, '-')
          let datefirebase = `${tarih}-${Date}`
          await db.collection(istayonname).doc(datefirebase).set({
            propverisi: newveri,
            gelenzaman: datefirebase
          })
          console.log('Veri gönderiliyor')
        }
      }
      }
      
    } catch (error) {
      console.error(error)
    }
  }
})






app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})






app.listen(port, () => {

  console.log(`server çalışıyor , http://${hostname}:${port}/`)
})






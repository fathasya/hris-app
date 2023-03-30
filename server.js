const express = require('express')
const app = express()
const flash = require('express-flash')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const login = require('./src/controllers/login')
const dashboard = require('./src/controllers/dashboard')
const masterdata = require('./src/controllers/master-data')
const dataPegawai = require('./src/controllers/data-pegawai')
const dataAbsensi = require('./src/controllers/data-absensi')
const formAddAbsensi = require('./src/controllers/add-absensi')
const addActivity = require('./src/controllers/add-activity')
const dailyActivity = require('./src/controllers/daily-activity')
const pengajuanCuti = require('./src/controllers/pengajuan-cuti')
const dataCutiPegawai = require('./src/controllers/data-cuti-pegawai')
const dataAbsensiPegawai = require('./src/controllers/data-absensi-pegawai')
const ubahPassword = require('./src/controllers/ubah-password')
const generatePdf = require('./src/controllers/generatePdf')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressLayouts)
app.use(flash())

app.get('/', (req,res) => {
    if(req.session.login){
        res.render('dashboard', {
            layout: 'layouts/mainLayout',
            title: 'Dashboard',
            username: req.session.username
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

app.post('/auth', login)

app.get('/dashboard', dashboard)
app.get('/delete-notif/(:id)', dashboard)

app.get('/master-data', masterdata)
app.get('/add-status', masterdata)
app.get('/add-divisi', masterdata)
app.get('/add-jabatan', masterdata)
app.get('/edit-status/(:id)', masterdata)
app.get('/edit-divisi/(:id)', masterdata)
app.get('/edit-jabatan/(:id)', masterdata)
app.post('/form-add-status', masterdata)
app.post('/form-add-divisi', masterdata)
app.post('/form-add-jabatan', masterdata)
app.post('/form-edit-status/:id', masterdata)
app.post('/form-edit-divisi/:id', masterdata)
app.post('/form-edit-jabatan/:id', masterdata)

app.get('/data-pegawai', dataPegawai)
app.get('/add-pegawai', dataPegawai)
app.get('/edit-pegawai/(:id)', dataPegawai)
app.get('/detail-pegawai/(:id)', dataPegawai)
app.get('/reset/(:id)', dataPegawai)
app.post('/search-pegawai', dataPegawai)
app.post('/form-add-pegawai', dataPegawai)
app.post('/form-edit-pegawai/:id', dataPegawai)

app.get('/daily-activity', dailyActivity)
app.get('/daily-activity/(:id)', dailyActivity)
app.get('/delete-activity/(:id)', dailyActivity)
app.get('/edit-activity/(:id)', dailyActivity)
app.post('/form-edit-activity/:id', dailyActivity)

app.get('/add-activity', addActivity)
app.post('/form-add-activity', addActivity)

app.get('/data-absensi', dataAbsensi)
app.get('/data-absensi/(:id)', dataAbsensi)

app.post('/form-add-absensi', formAddAbsensi)

app.get('/pengajuan-cuti', pengajuanCuti)
app.get('/add-pengajuan-cuti', pengajuanCuti)
app.get('/edit-pengajuan-cuti/(:id)', pengajuanCuti)
app.get('/delete-pengajuan-cuti/(:id)', pengajuanCuti)
app.post('/form-pengajuan-cuti', pengajuanCuti)
app.post('/form-edit-pengajuan-cuti/:id', pengajuanCuti)

app.get('/data-cuti-pegawai', dataCutiPegawai)
app.get('/edit-approval/(:id)', dataCutiPegawai)
app.post('/form-edit-approval/:id', dataCutiPegawai)
app.post('/search-cuti', dataCutiPegawai)

app.get('/data-absensi-pegawai', dataAbsensiPegawai)
app.post('/search-absensi', dataAbsensiPegawai)

app.get('/ubah-password', ubahPassword)
app.post('/form-ubah-password', ubahPassword)
app.post('/form-new-password', ubahPassword)

app.get('/print-data-pegawai', generatePdf)
app.get('/print-activity-pegawai/(:id)', generatePdf)
app.get('/print-cuti-pegawai', generatePdf)
app.get('/print-absensi-pegawai', generatePdf)

app.get('/logout', (req,res) => {
    if(req.session.login){
        req.session.login = false
        res.redirect('/')
    }
})

app.listen(3000, () => {
    console.log('Running on Port 3000');
})
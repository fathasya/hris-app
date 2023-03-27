const express = require('express')
const router = express.Router()
const conn = require('../models/conn')

// READ MASTER DATA
router.get('/master-data', (req,res) => {
    if(req.session.login){
        conn.query('SELECT * FROM status ORDER BY id_status', (err, rowStatus) => {
            if(err){
                req.flash('error', 'Data Not Found!')
                res.redirect('master-data')
            }else{
                conn.query('SELECT * FROM divisi ORDER BY id_divisi', (err, rowDivisi) => {
                    if(err){
                        req.flash('error', 'Data Not Found!')
                        res.redirect('master-data')
                    }else{
                        conn.query('SELECT * FROM jabatan ORDER BY id_jabatan', (err, rowJabatan)=>{
                            if(err){
                                req.flash('error', 'Data Not Found!')
                                res.redirect('master-data')
                            }else{
                                res.render('master-data', {
                                    layout: 'layouts/mainLayout',
                                    title: 'HRIS - Master Data',
                                    username: req.session.username,        
                                    id: req.sessionID,
                                    level: req.session.level,       
                                    status: rowStatus,
                                    divisi: rowDivisi,
                                    jabatan: rowJabatan
                                })
                
                            }
                        })
                    }
                })
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

//GET ADD STATUS
router.get('/add-status', (req, res) => {
    if(req.session.login){
        res.render('add-status', {
            layout: 'layouts/mainLayout',
            title: 'HRIS - Add Status Pegawai',
            username: req.session.username,
            id: req.session.id,
            level: req.session.level       
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

//POST ADD DATA STATUS
router.post('/form-add-status', (req, res) => {
    if(req.session.login){
        let data = {
            status : req.body.status
        }
        conn.query('INSERT INTO status SET ?', data, (err) => {
            if(err){
                // throw err
                req.flash('errors', 'Gagal Tambah Data')
                res.redirect('/master-data')
            }else{
                req.flash('successs', 'Berhasil Tambah Data')
                res.redirect('/master-data')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

//GET ADD DIVISI
router.get('/add-divisi', (req, res) => {
    if(req.session.login){
        res.render('add-divisi', {
            layout: 'layouts/mainLayout',
            title: 'HRIS - Add Divisi Pegawai',
            username: req.session.username,
            id: req.session.id,
            level: req.session.level       
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

//POST ADD DATA DIVISI
router.post('/form-add-divisi', (req, res) => {
    if(req.session.login){
        let data = {
            divisi : req.body.divisi
        }
        
        conn.query('INSERT INTO divisi SET ?', data , (err) => {
            if(err){
                req.flash('errordiv', 'Gagal Tambah Data')
                res.redirect('/master-data')
            }else{
                req.flash('successdiv', 'Berhasil Tambah Data')
                res.redirect('/master-data')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

//GET ADD JABATAN
router.get('/add-jabatan', (req, res) => {
    if(req.session.login){
        res.render('add-jabatan', {
            layout: 'layouts/mainLayout',
            title: 'HRIS - Add Jabatan Pegawai',
            username: req.session.username,
            id: req.session.id,
            level: req.session.level       
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

//POST ADD DATA JABATAN
router.post('/form-add-jabatan', (req, res) => {
    if(req.session.login){
        let data = {
            jabatan : req.body.jabatan
        }
        conn.query('INSERT INTO jabatan SET ?', data , (err) => {
            if(err){
                req.flash('errorj', 'Gagal Tambah Data')
                res.redirect('/master-data')
            }else{
                req.flash('successj', 'Berhasil Tambah Data')
                res.redirect('/master-data')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

// GET EDIT STATUS
router.get('/edit-status/(:id)', (req, res) => {
    if(req.session.login){
        const id_status = req.params.id
        conn.query('SELECT * FROM status WHERE id_status =' + id_status, (err, rows) => {
            if(err){
                // req.flash('error', err)
                res.redirect('/master-data')
            }else{
                res.render('edit-status', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Edit Data Status',
                    username: req.session.username,        
                    id: req.session.id,
                    level: req.session.level,       
                    data:rows
                })
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }

})

// POST EDIT DATA STATUS
router.post('/form-edit-status/:id', (req, res) => {
    if(req.session.login){
        const id_status = req.params.id
        let data = {
            status : req.body.status
        }
        conn.query('UPDATE status SET ? WHERE id_status = ' + id_status, data , (err) => {
            if(err){
                req.flash('errors', 'Gagal Edit Data')
                res.redirect('/master-data')
            }else{
                req.flash('successs', 'Berhasil Update Data')
                res.redirect('/master-data')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

// GET EDIT DIVISI
router.get('/edit-divisi/(:id)', (req, res) => {
    if(req.session.login){
        const id_divisi = req.params.id
        conn.query('SELECT * FROM divisi WHERE id_divisi =' + id_divisi, (err, rows) => {
            if(err){
                // req.flash('error', err)
                res.redirect('/master-data')
            }else{
                res.render('edit-divisi', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Edit Data Divisi',
                    username: req.session.username,        
                    id: req.session.id,
                    level: req.session.level,       
                    data:rows
                })
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }

})

// POST EDIT DATA DIVISI
router.post('/form-edit-divisi/:id', (req, res) => {
    if(req.session.login){
        const id_divisi = req.params.id
        let data = {
            divisi : req.body.divisi
        }
        conn.query('UPDATE divisi SET ? WHERE id_divisi = ' + id_divisi, data , (err) => {
            if(err){
                req.flash('errordiv', 'Gagal Edit Data')
                res.redirect('/master-data')
            }else{
                req.flash('successdiv', 'Berhasil Update Data')
                res.redirect('/master-data')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

// GET EDIT JABATAN
router.get('/edit-jabatan/(:id)', (req, res) => {
    if(req.session.login){
        const id_jabatan = req.params.id
        conn.query('SELECT * FROM jabatan WHERE id_jabatan =' + id_jabatan, (err, rows) => {
            if(err){
                // req.flash('error', err)
                res.redirect('/master-data')
            }else{
                res.render('edit-jabatan', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Edit Data jabatan',
                    username: req.session.username,        
                    id: req.session.id,
                    level: req.session.level,       
                    data:rows
                })
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }

})

// POST EDIT DATA JABATAN
router.post('/form-edit-jabatan/:id', (req, res) => {
    if(req.session.login){
        const id_jabatan = req.params.id
        let data = {
            jabatan : req.body.jabatan
        }
        conn.query('UPDATE jabatan SET ? WHERE id_jabatan = ' + id_jabatan, data , (err) => {
            if(err){
                req.flash('errorj', 'Gagal Edit Data')
                res.redirect('/master-data')
            }else{
                req.flash('successj', 'Berhasil Update Data')
                res.redirect('/master-data')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

module.exports = router
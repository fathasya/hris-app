const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const bcrypt = require('bcrypt')

// READ DATA PEGAWAI
router.get('/data-pegawai', (req,res) => {
    if(req.session.login){
        conn.query('SELECT *, (SELECT status FROM status WHERE status.id_status = pegawai.id_status)as status, (SELECT divisi FROM divisi WHERE divisi.id_divisi = pegawai.id_divisi)as divisi, (SELECT jabatan FROM jabatan WHERE jabatan.id_jabatan = pegawai.id_jabatan)as jabatan FROM pegawai ORDER BY id_user desc', (err, rows) => {
            if(err){
                req.flash('error', err)
                res.redirect('data-pegawai')
            }else{
                res.render('data-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Data Pegawai',
                    username: req.session.username,        
                    id: req.sessionID,
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

// READ DETAIL PEGAWAI
router.get('/detail-pegawai/(:id)', (req, res) => {
    if(req.session.login){
        const id_user = req.params.id
        conn.query('SELECT *, (SELECT status FROM status WHERE status.id_status = pegawai.id_status)as status, (SELECT divisi FROM divisi WHERE divisi.id_divisi = pegawai.id_divisi)as divisi, (SELECT jabatan FROM jabatan WHERE jabatan.id_jabatan = pegawai.id_jabatan)as jabatan, (SELECT email FROM users WHERE users.id_user = pegawai.id_user) as email FROM pegawai WHERE id_user =' + id_user, (err, rows) => {
            if(err){
                // req.flash('error', err)
                res.redirect('/data-pegawai')
            }else{
                res.render('detail-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Detail Pegawai',
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

// READ FORM ADD DATA PEGAWAI
router.get('/add-pegawai', (req, res) => {
    if(req.session.login){
        conn.query('SELECT * FROM status', (err, status)=>{
            if(err){
                res.render('add-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Add Pegawai',
                    username: req.session.username,
                    id: req.session.id,
                    level: req.session.level,
                    status: ''       
                })
            }else{
                conn.query('SELECT * FROM divisi', (err, divisi)=>{
                    if(err){
                        res.render('add-pegawai', {
                            layout: 'layouts/mainLayout',
                            title: 'HRIS - Add Pegawai',
                            username: req.session.username,
                            id: req.session.id,
                            level: req.session.level,
                            status: status,
                            divisi: ''     
                        })
                    }else{
                        conn.query('SELECT * FROM jabatan', (err, jabatan)=>{
                            if(err){
                                res.render('add-pegawai', {
                                    layout: 'layouts/mainLayout',
                                    title: 'HRIS - Add Pegawai',
                                    username: req.session.username,
                                    id: req.session.id,
                                    level: req.session.level,
                                    status: status,
                                    divisi: divisi,
                                    jabatan: ''     
                                })
                            }else{
                                res.render('add-pegawai', {
                                    layout: 'layouts/mainLayout',
                                    title: 'HRIS - Add Pegawai',
                                    username: req.session.username,
                                    id: req.session.id,
                                    level: req.session.level,
                                    status: status,
                                    divisi: divisi,
                                    jabatan: jabatan
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

// ADD DATA TO DB
router.post('/form-add-pegawai', (req, res) => {
    if(req.session.login){
        let username = req.body.nama
        let email = req.body.email
        let pw = '123'
        bcrypt.hash(pw, 10, (err, hash) => {
            if(err) throw err
            var password = hash
            var data_users = {
                username: req.body.nama,
                email: req.body.email,
                password: password,
                level: '1'
            }
            // CEK EMAIL NYA UDAH ADA BELUM, KALO UDAH GABOLEH
            conn.query('SELECT email FROM users WHERE email = ?', [email], (err,results) => {
                if(err) throw err
                if(results.length > 1){
                    req.flash('error', 'Email Sudah Ada!')
                    res.redirect('/add-pegawai')
                }else{
                    conn.query('INSERT INTO users SET?', data_users, (err) => {
                        if(err){
                            req.flash('error', 'Oops, Terjadi Kesalahan!')
                            res.redirect('/add-pegawai')
                        }else{
                            conn.query('SELECT id_user FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
                                if (error) {
                                    throw error
                                }else{
                                    if(results.length > 0){
                                        for(var i = 0; i< results.length; i++){
                                            req.id_user_pegawai = results[i].id_user
                                        }
                                    }
                                }
                                var data_pegawai = {
                                    id_user : req.id_user_pegawai,
                                    nik: req.body.nik,
                                    nama: req.body.nama,
                                    tgl_lahir: req.body.tgl_lahir,
                                    no_hp: req.body.no_hp,
                                    no_kontrak: req.body.no_kontrak,
                                    id_status: req.body.status,
                                    id_divisi: req.body.divisi,
                                    id_jabatan: req.body.jabatan,
                                    pendidikan: req.body.pendidikan,
                                    email_kantor: req.body.email_kantor,
                                    alamat: req.body.alamat
                                }
                                conn.query('INSERT INTO pegawai SET?', data_pegawai, (err) => {
                                    if(err){
                                        // throw err
                                        req.flash('error', 'Gagal Tambah Data')
                                        res.redirect('/data-pegawai')
                                    }else{
                                        req.flash('success', 'Berhasil Tambah Data')
                                        res.redirect('/data-pegawai')        
                                    }
                                })
                            })
                        }
                    })
                }
            })
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

// GET FORM EDIT DATA PEGAWAI
router.get('/edit-pegawai/(:id)', (req, res) => {
    if(req.session.login){
        const id_user = req.params.id
        conn.query('SELECT * FROM status', (err, status)=>{
            if(err){
                res.render('edit-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Edit Data Pegawai',
                    username: req.session.username,        
                    id: req.session.id,
                    level: req.session.level,       
                    status: ''       
                })
            }else{
                conn.query('SELECT * FROM divisi', (err, divisi)=>{
                    if(err){
                        res.render('edit-pegawai', {
                            layout: 'layouts/mainLayout',
                            title: 'HRIS - Edit Data Pegawai',
                            username: req.session.username,        
                            id: req.session.id,
                            level: req.session.level,       
                            status: status,
                            divisi: ''     
                        })
                    }else{
                        conn.query('SELECT * FROM jabatan', (err, jabatan)=>{
                            if(err){
                                res.render('edit-pegawai', {
                                    layout: 'layouts/mainLayout',
                                    title: 'HRIS - Edit Data Pegawai',
                                    username: req.session.username,        
                                    id: req.session.id,
                                    level: req.session.level,       
                                    status: status,
                                    divisi: divisi,
                                    jabatan: ''     
                                })
                            }else{
                                conn.query('SELECT *, (SELECT status FROM status WHERE status.id_status = pegawai.id_status)as status, (SELECT divisi FROM divisi WHERE divisi.id_divisi = pegawai.id_divisi)as divisi, (SELECT jabatan FROM jabatan WHERE jabatan.id_jabatan = pegawai.id_jabatan)as jabatan, (SELECT email FROM users WHERE users.id_user = pegawai.id_user) as email FROM pegawai WHERE id_user =' + id_user, (err, rows) => {
                                    if(err){
                                        res.render('edit-pegawai', {
                                            layout: 'layouts/mainLayout',
                                            title: 'HRIS - Edit Data Pegawai',
                                            username: req.session.username,        
                                            id: req.session.id,
                                            level: req.session.level,       
                                            status: status,
                                            divisi: divisi,
                                            jabatan: jabatan,
                                            data: ''
                                        })
                                    }else{                                
                                        res.render('edit-pegawai', {
                                            layout: 'layouts/mainLayout',
                                            title: 'HRIS - Edit Data Pegawai',
                                            username: req.session.username,        
                                            id: req.session.id,
                                            level: req.session.level,       
                                            status: status,
                                            divisi: divisi,
                                            jabatan: jabatan,
                                            data:rows                 
                                        })
                                    }
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

router.post('/form-edit-pegawai/:id', (req, res) => {
    if(req.session.login){
        let id_user = req.params.id
        var data_users = {
            username: req.body.nama,
            email: req.body.email
        }
        var data_pegawai = {
            id_user : req.params.id,
            nik: req.body.nik,
            nama: req.body.nama,
            tgl_lahir: req.body.tgl_lahir,
            no_hp: req.body.no_hp,
            no_kontrak: req.body.no_kontrak,
            id_status: req.body.status,
            id_divisi: req.body.divisi,
            id_jabatan: req.body.jabatan,
            pendidikan: req.body.pendidikan,
            email_kantor: req.body.email_kantor,
            alamat: req.body.alamat
        }
        conn.query('UPDATE pegawai SET ? WHERE id_user = ' + id_user, data_pegawai, (err) => {
            if(err){
                req.flash('error', err)
                res.redirect('/data-pegawai')
            }else{
                conn.query('UPDATE users SET ? WHERE id_user = ' + id_user, data_users, (err) => {
                    if(err){
                        // throw err
                        req.flash('error', 'Gagal Edit Data')
                        res.redirect('/data-pegawai')
                    }else{
                        req.flash('success', 'Berhasil Update Data')
                        res.redirect('/data-pegawai')        
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

router.get('/reset/(:id)', (req, res) => {
    if(req.session.login){
        let id_user = req.params.id
        let pw = '123'
        bcrypt.hash(pw, 10, (err, hash) => {
            if(err) throw err
            var password = hash
            var data = {
                password: password,
            }
            conn.query('UPDATE users SET ? WHERE id_user = ' + id_user, data, (err) => {
                if(err){
                    req.flash('error', 'Gagal Reset Password Pegawai!')
                    res.redirect('/data-pegawai')
                }else{
                    req.flash('success', 'Berhasil Reset Password Pegawai!')
                    res.redirect('/data-pegawai')        
                }
            })
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

router.post('/search-pegawai', (req, res) => {
    if(req.session.login){
            var data = "'%"+req.body.search_pegawai+"%'"
            conn.query(`SELECT *, (SELECT status FROM status WHERE status.id_status = pegawai.id_status)as status, (SELECT divisi FROM divisi WHERE divisi.id_divisi = pegawai.id_divisi)as divisi, (SELECT jabatan FROM jabatan WHERE jabatan.id_jabatan = pegawai.id_jabatan)as jabatan FROM pegawai WHERE nik LIKE ${data} or nama LIKE ${data}`, (err,results) => {
                if(err){
                    res.render('data-pegawai', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Pegawai',
                        username: req.session.username,        
                        id: req.sessionID,
                        level: req.session.level,       
                        data:''
                    })
                }else{
                    res.render('data-pegawai', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Pegawai',
                        username: req.session.username,        
                        id: req.sessionID,
                        level: req.session.level,       
                        data: results
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
module.exports = router
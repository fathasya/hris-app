const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const flash = require('express-flash')

// READ DATA PENGAJUAN CUTI
router.get('/data-cuti-pegawai', (req,res) => {
    if(req.session.login){
        conn.query('SELECT *, (SELECT username FROM users WHERE users.id_user = cuti_pegawai.id_user and users.level = 1) as nama FROM cuti_pegawai ORDER BY id_cuti_pegawai DESC', (err, rows) => {
            if(err){
                req.flash('error', err)
                res.render('data-cuti-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Data Cuti Pegawai',
                    username: req.session.username,        
                    id: req.session.id,
                    level: req.session.level,            
                    data:''
                })
            }else{
                res.render('data-cuti-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Data Cuti Pegawai',
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

// GET HALAMAN EDIT APPROVAL
router.get('/edit-approval/(:id)', (req,res) => {
    if(req.session.login){
        const id_cuti_pegawai = req.params.id
        conn.query('SELECT *, (SELECT username FROM users WHERE users.id_user = cuti_pegawai.id_user and users.level = 1) as nama FROM cuti_pegawai WHERE id_cuti_pegawai = ' + id_cuti_pegawai, (err, rows) => {
            if(err){
                throw err
                // req.flash('error', err)
                res.redirect('/data-cuti-pegawai')
            }else{
                res.render('edit-approval', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Edit Status Pengajuan',
                    username: req.session.username,
                    email: req.session.email,
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

// UPDATE STATUS APPROVAL KE DB
router.post('/form-edit-approval/:id', (req,res) => {
    if(req.session.login){
        let id_cuti_pegawai = req.params.id
        var data = {
            tgl_mulai: req.body.tgl_mulai,
            tgl_selesai: req.body.tgl_selesai,
            ket: req.body.ket,
            jumlah_hari: req.body.jumlah_hari,
            status: req.body.status
        }
        conn.query('UPDATE cuti_pegawai SET ? WHERE id_cuti_pegawai = ' + id_cuti_pegawai, data, (err) => {
            if(err){
                req.flash('error', 'Gagal Edit Status')
                res.redirect('/data-cuti-pegawai')
            }else{
                conn.query('SELECT * FROM cuti_pegawai WHERE id_cuti_pegawai = ' + id_cuti_pegawai, (err, results) => {
                    if(err) throw err
                    if(results.length > 0){
                        for(var i = 0; i< results.length; i++){
                            var id_user = results[i].id_user
                        }
                    }
                    var data_temp = {
                        id_user: id_user,
                        tgl_mulai: req.body.tgl_mulai,
                        tgl_selesai: req.body.tgl_selesai,
                        status: req.body.status
                    }
                    conn.query('INSERT INTO temp SET ?', data_temp, (err) => {
                        if(err){
                            req.flash('error', 'Gagal Edit Status')
                            res.redirect('/data-cuti-pegawai')
                        }else{
                            req.flash('success', 'Berhasil Update Data')
                            res.redirect('/data-cuti-pegawai')        
                        }
                    })
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

router.post('/search-cuti', (req, res) => {
    if(req.session.login){
            var data = "'%"+req.body.search_cuti+"%'"
            conn.query(`SELECT *, (SELECT username FROM users WHERE users.id_user = cuti_pegawai.id_user and users.username LIKE ${data} and users.level = 1) as nama FROM cuti_pegawai ORDER BY id_cuti_pegawai DESC`, (err,results) => {
                if(err){
                    res.render('data-cuti-pegawai', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Cuti Pegawai',
                        username: req.session.username,        
                        id: req.sessionID,
                        level: req.session.level,       
                        data:''
                    })
                }else{
                    res.render('data-cuti-pegawai', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Cuti Pegawai',
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
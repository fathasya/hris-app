const express = require('express')
const router = express.Router()
const conn = require('../models/conn')

router.get('/data-absensi-pegawai', (req,res) => {
    if(req.session.login){
        conn.query('SELECT *, (SELECT COUNT(absensi.id_user) FROM absensi WHERE absensi.id_user = pegawai.id_user) as total_hadir, (SELECT SUM(cuti_pegawai.jumlah_hari) FROM cuti_pegawai WHERE cuti_pegawai.status = 2 and cuti_pegawai.id_user = pegawai.id_user) as total_cuti FROM pegawai', (err, rows) => {
            if(err){
                req.flash('error', err)
                res.render('data-absensi-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Data Absensi Pegawai',
                    username: req.session.username,        
                    id: req.session.id,
                    level: req.session.level,       
                    data:''
                })
            }else{
                res.render('data-absensi-pegawai', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Data Absensi Pegawai',
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

router.post('/search-absensi', (req, res) => {
    if(req.session.login){
            var data = "'%"+req.body.search_absensi+"%'"
            conn.query(`SELECT *, (SELECT COUNT(absensi.id_user) FROM absensi WHERE absensi.id_user = pegawai.id_user) as total_hadir, (SELECT SUM(cuti_pegawai.jumlah_hari) FROM cuti_pegawai WHERE cuti_pegawai.status = 2 and cuti_pegawai.id_user = pegawai.id_user) as total_cuti FROM pegawai WHERE nama LIKE ${data}`, (err,results) => {
                if(err){
                    res.render('data-absensi-pegawai', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Absensi Pegawai',
                        username: req.session.username,        
                        id: req.sessionID,
                        level: req.session.level,       
                        data:''
                    })
                }else{
                    res.render('data-absensi-pegawai', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Absensi Pegawai',
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
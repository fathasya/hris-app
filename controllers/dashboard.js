const express = require('express')
const router = express.Router()
const conn = require('../models/conn')

router.get('/dashboard', (req,res) => {
    if(req.session.login){
        const username = req.session.username
        const email = req.session.email
        const level = req.session.level
        conn.query('SELECT * FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var id_user = results[i].id_user
                }
            }
            if(level == 1){
                const id = id_user
                conn.query('SELECT COUNT(id_user) as hadir, (SELECT SUM(jumlah_hari) FROM cuti_pegawai WHERE cuti_pegawai.status = 2 and cuti_pegawai.id_user = absensi.id_user) as absen FROM absensi WHERE id_user =  ' + id, (err, rows) => {
                    if(err){
                        res.render('dashboard', {
                            layout: 'layouts/mainLayout',
                            title: 'Dashboard',
                            id: req.session.id,
                            username: req.session.username,
                            email : req.session.email,
                            level: req.session.level,
                            data:''
                        })
                    }else{
                        conn.query('SELECT * FROM temp WHERE id_user = ? ORDER BY id_temp_cuti DESC', [id], (err, results) => {
                            if(err){
                                res.render('dashboard', {
                                    layout: 'layouts/mainLayout',
                                    title: 'Dashboard',
                                    id: req.session.id,
                                    username: req.session.username,
                                    email : req.session.email,
                                    level: req.session.level,
                                    data:rows,
                                    notif: ''
                                })
                            }else{
                                res.render('dashboard', {
                                    layout: 'layouts/mainLayout',
                                    title: 'Dashboard',
                                    id: req.session.id,
                                    username: req.session.username,
                                    email : req.session.email,
                                    level: req.session.level,
                                    data:rows,
                                    notif: results
                                })
                            }
                        })
                    }
                })
            }else if(level == 2) {
                const id = id_user
                let hari = new Date().getDate()
                let bulan = new Date().getMonth()+1
                const tahun = new Date().getFullYear()
                const tgl = "'"+tahun+'-'+bulan+'-'+hari+"'"
                conn.query(`SELECT COUNT(id_user) as jumlah_pegawai, (SELECT COUNT(id_user) FROM absensi WHERE absensi.tgl = ${tgl} )as pegawai_hadir FROM pegawai`, (err,rows) => {
                    if(err){
                        res.render('dashboard', {
                            layout: 'layouts/mainLayout',
                            title: 'Dashboard',
                            id: req.session.id,
                            username: req.session.username,
                            email : req.session.email,
                            level: req.session.level,
                            data:''
                        })
                    }else{
                        conn.query('SELECT *, (SELECT username FROM users WHERE users.id_user = cuti_pegawai.id_user)as nama FROM cuti_pegawai WHERE status = 1', (err, data) => {
                            if(err){
                                res.render('dashboard', {
                                    layout: 'layouts/mainLayout',
                                    title: 'Dashboard',
                                    id: req.session.id,
                                    username: req.session.username,
                                    email : req.session.email,
                                    level: req.session.level,
                                    data: rows,
                                    notif: ''
                                })
        
                            }else{
                                res.render('dashboard', {
                                    layout: 'layouts/mainLayout',
                                    title: 'Dashboard',
                                    id: req.session.id,
                                    username: req.session.username,
                                    email : req.session.email,
                                    level : req.session.level,
                                    data : rows,
                                    notif : data
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

// DELETE NOTIF
router.get('/delete-notif/(:id)', (req,res) => { 
    if(req.session.login){
        const id_temp_cuti = req.params.id
        const username = req.session.username
        const email = req.session.email
        conn.query('SELECT * FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var id_user = results[i].id_user
                }
            }
            conn.query('DELETE FROM temp WHERE id_temp_cuti = ? and id_user = ?', [id_temp_cuti, id_user], (err) => {
                if(err){
                    req.flash('error_notif', 'Gagal Hapus Data!')
                    res.redirect('/dashboard')
                }else{
                    req.flash('success_notif', 'Notif Berhasil Dihapus.')
                    res.redirect('/dashboard')
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

module.exports = router
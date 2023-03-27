const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const { route } = require('./login')

router.get('/add-absensi', (req, res) => {
    if(req.session.login){
        res.render('add-absensi', {
            layout: 'layouts/mainLayout',
            title: 'HRIS - Absen Pegawai',
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

router.post('/form-add-absensi', (req, res) => {
    if(req.session.login){
        const username = req.session.username
        const email = req.session.email
        conn.query('SELECT * FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var id = results[i].id_user
                }
            }
            const id_user = id
            let hari = new Date().getDate()
            let bulan = new Date().getMonth()+1
            const tahun = new Date().getFullYear()
            const tgl = tahun+'-'+bulan+'-'+hari
            var data = {
                id_user : id,
                tgl : tgl,
                jam: new Date().toLocaleTimeString()
            }
            conn.query('SELECT * FROM absensi WHERE id_user = ? and tgl = ?', [id_user, tgl], (err,results) => {
                if(err) throw err
                if(results.length > 0){
                    // console.log(results);
                    req.flash('error', 'Anda Sudah Absen Hari Ini!')
                    res.redirect('/dashboard')
                }else{
                    conn.query('INSERT INTO absensi SET ?', data, (err) => {
                        if(err) {
                            req.flash('error', 'Terjadi Kesalahan, Silahkan Coba Lagi.')
                            res.redirect('/dashboard')
                        }else{
                            req.flash('success', 'Berhasil Absen')
                            res.redirect('/dashboard')
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


module.exports = router
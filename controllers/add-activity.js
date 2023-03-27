const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const { route } = require('./login')

router.get('/add-activity', (req, res) => {
    if(req.session.login){
        res.render('add-activity', {
            layout: 'layouts/mainLayout',
            title: 'HRIS - Daily Activity',
            id_user: req.session.id,
            username: req.session.username,
            email: req.session.email,
            level: req.session.level,        
            detail: ""
        })
    }
})

router.post('/form-add-activity', (req, res) => {
    if(req.session.login){
        const username = req.session.username
        const email = req.session.email
        conn.query('SELECT * FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var id_user = results[i].id_user
                }
            }
            var data = {
                id_user: id_user,
                tgl: req.body.tgl,
                detail: req.body.detail,
            }
            conn.query('INSERT INTO daily_activity SET?', data, (err) => {
                if(err) {
                    req.flash('error', 'Gagal Tambah Data')
                    res.redirect('/daily-activity')
                }else{
                    req.flash('success', 'Berhasil Tambah Data')
                    res.redirect('/daily-activity')
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
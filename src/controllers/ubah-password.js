const express = require('express')
const session = require('express-session')
const router = express.Router()
const conn = require('../models/conn')
const bcrypt = require('bcrypt')

router.get('/ubah-password', (req,res) => {
    if(req.session.login){
        res.render('old-password', {
            layout:'layouts/mainLayout',
            title:'HRIS - Ubah Password',
            id: req.session.id,
            username: req.session.username,
            email: req.session.email,
            level: req.session.level,            
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

router.post('/form-ubah-password', (req,res) => {
    if(req.session.login){
        const email = req.session.email
        const password = req.body.password
        conn.query('SELECT * from users WHERE email = ?', [email], (err, results) => {
            if(err) throw err
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var pw = results[i].password
                }
                bcrypt.compare(password, pw, (err, results) => {
                    if(results){
                        res.render('new-password', {
                            layout:'layouts/mainLayout',
                            title:'HRIS - Ubah Password',
                            id: req.session.id,
                            username: req.session.username,
                            email: req.session.email,
                            level: req.session.level,            
                        })        
                    }else{
                        req.flash('error', 'Password Yang Anda Masukkan Salah.')
                        res.redirect('/ubah-password')
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

router.post('/form-new-password', (req,res) => {
    if(req.session.login){
        const email = "'"+req.session.email+"'"
        const pw = req.body.password
        bcrypt.hash(pw, 10, (err, hash) => {
            if(err) throw err
            var password = hash
            var data = {
                password: password,
            }
            conn.query('UPDATE users SET ? WHERE email = ' + email, data, (err) => {
                if(err){
                    // throw err
                    req.flash('error', 'Gagal Ubah Password')
                    res.redirect('/ubah-password')
                }else{
                    req.flash('success', 'Berhasil Ubah Password, Silahkan Login Ulang!')
                    res.redirect('/logout')
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
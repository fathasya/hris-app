const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const bcrypt = require('bcrypt')

router.post('/auth', (req,res) => {
    var email = req.body.email
    var password = req.body.password
    if(email){
        conn.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    req.session.id = results[i].id_user
                    req.session.username = results[i].username
                    req.session.email = results[i].email
                    req.session.level = results[i].level
                    var pw = results[i].password
                }
                bcrypt.compare(password, pw, (err, results) => {
                    if(results){
                        req.session.login = true
                        res.redirect('/dashboard')        
                    }else{
                        // throw err
                        req.flash('error', 'Email atau Password Salah')
                        res.render('login', {
                            layout: 'login',
                            title: 'Login - HRIS'                        
                        })
                    }
                })
            }else{
                req.flash('error', 'Email atau Password Salah')
                res.redirect('/login')
            }
            // res.end()
        })
    }else{
        req.flash('error', 'Harap Masukkan Email and Password')
        res.redirect('/login')
    }
})

module.exports = router
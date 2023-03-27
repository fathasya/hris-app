const express = require('express')
const router = express.Router()
const conn = require('../models/conn')

router.get('/data-absensi', (req,res) => {
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
            conn.query('SELECT * FROM absensi WHERE id_user = ? ORDER BY tgl', [id_user], (err, rows) => {
                if(err){
                    req.flash('error', 'Data Not Found')
                    res.render('data-absensi', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Pegawai',
                        id: req.session.id,
                        username: req.session.username, 
                        email : req.session.email,       
                        level: req.session.level,                   
                        data:''
                    })
                }else{
                    res.render('data-absensi', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Absensi',
                        id: req.session.id,
                        username: req.session.username,
                        email : req.session.email,       
                        level: req.session.level,            
                        data:rows
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

router.get('/data-absensi/(:id)', (req,res) => {
    if(req.session.login){
        let id_user = req.params.id
        conn.query('SELECT * FROM absensi WHERE id_user = ? ORDER BY tgl', [id_user], (err, rows) => {
            if(err){
                req.flash('error', err)
                res.render('/data-pegawai')
            }else{
                res.render('data-absensi', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Data Absensi',
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

module.exports = router
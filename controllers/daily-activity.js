const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const { route } = require('./login')

// GET DAILY ACTIVITY FOR PEGAWAI
router.get('/daily-activity', (req,res) => {
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
            conn.query('SELECT * FROM daily_activity WHERE id_user = ? ORDER BY id_activity DESC', [id_user], (err, rows) => {
                if(err){
                    req.flash('error', 'Data Not Found')
                    res.render('catatan-daily-activity', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Daily Activity',
                        id: req.session.id,
                        username: req.session.username, 
                        email : req.session.email,       
                        level: req.session.level,       
                        data:''
                    })
                }else{
                    res.render('catatan-daily-activity', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Daily Activity',
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

// GET DAILY ACTIVITY FOR ADMIN
router.get('/daily-activity/(:id)', (req,res) => {
    if(req.session.login){
        const id_user = req.params.id
        conn.query('SELECT *, (SELECT nama FROM pegawai WHERE pegawai.id_user = daily_activity.id_user)as nama FROM daily_activity WHERE id_user = ? ORDER BY id_activity DESC', [id_user], (err, rows) => {
            if(err){
                // req.flash('error', 'Data Not Found')
                res.redirect('/data-pegawai')
            }else{
    
                res.render('daily-activity-admin', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Activity Pegawai',
                    id: req.session.id,
                    username: req.session.username,
                    email : req.session.email,        
                    level: req.session.level,       
                    data: rows
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

// EDIT DAILY ACTIVITY
router.get('/edit-activity/(:id)', (req,res) => {
    if(req.session.login){
        const id_activity = req.params.id
        conn.query('SELECT * FROM daily_activity WHERE id_activity = ' + id_activity, (err, rows) => {
            if(err){
                // req.flash('error', 'Data Not Found!')
                res.redirect('/daily-activity')
            }else{
                res.render('edit-activity', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Daily Activity',
                    id: req.session.id,
                    username: req.session.username,   
                    email : req.session.email,     
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

// POST DATA EDIT ACTIVITY TO DB
router.post('/form-edit-activity/:id', (req, res) => {
    if(req.session.login){
        let id_activity = req.params.id
        var data = {
            tgl: req.body.tgl,
            detail: req.body.detail
        }
        conn.query('UPDATE daily_activity SET ? WHERE id_activity = ' + id_activity, data, (err) => {
            if(err){
                // throw err
                req.flash('error', 'Gagal Update Data')
                res.redirect('/daily-activity')
            }else{
                req.flash('success', 'Berhasil Update Data')
                res.redirect('/daily-activity')
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

// DELETE DAILY ACTIVITY
router.get('/delete-activity/(:id)', (req,res) => { 
    if(req.session.login){
        const id_activity = req.params.id
        const username = req.session.username
        const email = req.session.email
        conn.query('SELECT * FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var id_user = results[i].id_user
                }
            }
            conn.query('DELETE FROM daily_activity WHERE id_activity = ? and id_user = ?', [id_activity, id_user], (err) => {
                if(err){
                    req.flash('error', 'Gagal Hapus Data!')
                    res.redirect('/daily-activity')
                }else{
                    req.flash('success', 'Berhasil Hapus Data!')
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
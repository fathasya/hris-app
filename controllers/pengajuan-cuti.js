const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const flash = require('express-flash')

// TAMPILKAN DATA PENGAJUAN CUTI
router.get('/pengajuan-cuti', (req,res) => {
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
            conn.query('SELECT * FROM cuti_pegawai WHERE id_user = ? ORDER BY id_cuti_pegawai DESC', [id_user], (err, rows) => {
                if(err){
                    req.flash('error', err)
                    res.render('pengajuan-cuti', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Pengajuan Cuti',
                        id: req.session.id,
                        username: req.session.username,      
                        email: req.session.email,
                        level: req.session.level,              
                        data:''
                    })
                }else{
                    res.render('pengajuan-cuti', {
                        layout: 'layouts/mainLayout',
                        title: 'HRIS - Data Pengajuan Cuti',
                        id: req.session.id,
                        username: req.session.username,
                        email: req.session.email,
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

// TAMPILKAN HALAMAN PENGAJUAN CUTI
router.get('/add-pengajuan-cuti', (req,res) => {
    if(req.session.login){
        res.render('add-pengajuan-cuti', {
            layout: 'layouts/mainLayout',
            title: 'HRIS - Ajukan Cuti',
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

// ADD DATA PENGAJUAN CUTI KE DB
router.post('/form-pengajuan-cuti', (req, res) => {
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
                tgl_mulai: req.body.tgl_mulai,
                tgl_selesai: req.body.tgl_selesai,
                ket: req.body.ket,
                jumlah_hari: req.body.jumlah_hari,
                status: 1
            }
            conn.query('INSERT INTO cuti_pegawai SET?', data, (err) => {
                if(err) {
                    req.flash('error', 'Gagal Tambah Data')
                    res.redirect('dashboard')
                }else{
                    req.flash('success', 'Berhasil Tambah Data')
                    res.redirect('pengajuan-cuti')
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

// TAMPILKAN HALAMAN EDIT PENGAJUAN CUTI
router.get('/edit-pengajuan-cuti/(:id)', (req,res) => {
    if(req.session.login){
        const id_cuti_pegawai = req.params.id
        conn.query('SELECT * FROM cuti_pegawai WHERE id_cuti_pegawai =' + id_cuti_pegawai, (err, rows) => {
            if(err){
                // req.flash('error', 'Oops! Terjadi Kesalahan.')
                res.redirect('/pengajuan-cuti')
            }else{
                res.render('edit-pengajuan-cuti', {
                    layout: 'layouts/mainLayout',
                    title: 'HRIS - Edit Pengajuan Cuti',
                    id: req.session.id,
                    username: req.session.username,
                    email: req.session.email,
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

// TAMPILKAN HALAMAN EDIT PENGAJUAN CUTI
router.post('/form-edit-pengajuan-cuti/:id', (req,res) => {
    if(req.session.login){
        const id_cuti_pegawai = req.params.id
        var data = {
            tgl_mulai: req.body.tgl_mulai,
            tgl_selesai: req.body.tgl_selesai,
            ket: req.body.ket,
            jumlah_hari: req.body.jumlah_hari,
            status: 1
        }
        conn.query('UPDATE cuti_pegawai SET ? WHERE id_cuti_pegawai =' + id_cuti_pegawai, data, (err, rows) => {
            if(err){
                // req.flash('error', 'Oops! Terjadi Kesalahan.')
                res.redirect('/pengajuan-cuti')
            }else{
                req.flash('success', 'Berhasil Update Data')
                res.redirect('/pengajuan-cuti')        
            }
        })
    }else{
        res.render('login', {
            layout: 'login',
            title: 'Login - HRIS'
        })
    }
})

// DELETE PENGAJUAN CUTI
router.get('/delete-pengajuan-cuti/(:id)', (req,res) => { 
    if(req.session.login){
        const id_cuti_pegawai = req.params.id
        const username = req.session.username
        const email = req.session.email
        conn.query('SELECT * FROM users WHERE username = ? and email = ?', [username, email], (error, results) => {
            if(error) throw error
            if(results.length > 0){
                for(var i = 0; i< results.length; i++){
                    var id_user = results[i].id_user
                }
            }
            conn.query('DELETE FROM cuti_pegawai WHERE id_cuti_pegawai = ? and id_user = ?', [id_cuti_pegawai, id_user], (err) => {
                if(err){
                    req.flash('error', 'Gagal Hapus Data!')
                    res.redirect('/pengajuan-cuti')
                }else{
                    req.flash('success', 'Berhasil Hapus Data!')
                    res.redirect('/pengajuan-cuti')
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
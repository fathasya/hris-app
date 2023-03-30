const express = require('express')
const router = express.Router()
const conn = require('../models/conn')
const fs = require('fs')
const pdf = require('pdf-creator-node')
const path = require('path')

// PRINT DAILY-ACTIVITY-PEGAWAI
router.get('/print-activity-pegawai/(:id)', (req,res) => {
    const id_user = req.params.id
    const html = fs.readFileSync(path.join(__dirname, '../views/print-activity.html'), 'utf-8')
    const fileName = 'data-activity-pegawai/'+id_user+'.pdf'
    let array = []
    conn.query('SELECT *, (SELECT nama FROM pegawai WHERE pegawai.id_user = daily_activity.id_user)as nama FROM daily_activity WHERE id_user = ? ORDER BY id_activity DESC', [id_user], (err, rows) => {
        if(err){
            throw err
        }else{
            rows.forEach(r => {
                const datas = {
                    nama: r.nama.toUpperCase(),
                    tgl: r.tgl.toUTCString().slice(4,16),
                    detail: r.detail.toUpperCase(),
                }
                array.push(datas);
            });

            const activity = {
                data: array,
            }

            const document = {
                html: html,
                data: {
                    results: activity
                },
                path: './public/'+fileName
            }
            pdf.create(document)
            
            const filePath = 'http://localhost:3000/'+fileName;

            res.redirect(filePath)
        }
    })    
})

// PRINT DATA-CUTI-PEGAWAI
router.get('/print-cuti-pegawai', (req,res) => {
    const html = fs.readFileSync(path.join(__dirname, '../views/print-data-cuti.html'), 'utf-8')
    const fileName = 'data-cuti-pegawai.pdf'
    let array = []
    conn.query('SELECT *, (SELECT username FROM users WHERE users.id_user = cuti_pegawai.id_user and users.level = 1) as nama FROM cuti_pegawai ORDER BY id_cuti_pegawai DESC', (err, rows) => {
        if(err){
            throw err
        }else{
            rows.forEach(r => {
                const datas = {
                    nama: r.nama,
                    tgl_mulai: r.tgl_mulai.toUTCString().slice(4,16) ,
                    tgl_selesai: r.tgl_selesai.toUTCString().slice(4,16),
                    jumlah_hari: r.jumlah_hari,
                    ket: r.ket
                }
                array.push(datas);
            });

            const data_cuti = {
                data: array,
            }

            const document = {
                html: html,
                data: {
                    results: data_cuti
                },
                path: './public/'+fileName
            }
            pdf.create(document)
            
            const filePath = 'http://localhost:3000/'+fileName;

            res.redirect(filePath)
        }
    })    
})

// PRINT DATA-ABSENSI-PEGAWAI
router.get('/print-absensi-pegawai', (req,res) => {
    const html = fs.readFileSync(path.join(__dirname, '../views/print-absensi.html'), 'utf-8')
    const fileName = 'data-absensi-pegawai.pdf'
    let array = []
    conn.query('SELECT *, (SELECT COUNT(absensi.id_user) FROM absensi WHERE absensi.id_user = pegawai.id_user) as total_hadir, (SELECT SUM(cuti_pegawai.jumlah_hari) FROM cuti_pegawai WHERE cuti_pegawai.status = 2 and cuti_pegawai.id_user = pegawai.id_user) as total_cuti FROM pegawai', (err, rows) => {
        if(err){
            throw err
        }else{
            rows.forEach(r => {
                if(r.total_cuti == null){
                    var cuti = '0'
                }else if(r.total_cuti != null){
                    var cuti = r.total_cuti
                }
                const datas = {
                    nama: r.nama.toUpperCase(),
                    total_hadir: r.total_hadir,
                    total_cuti: cuti
                }
                array.push(datas);
            });

            const absensi = {
                data: array,
            }

            const document = {
                html: html,
                data: {
                    results: absensi
                },
                path: './public/'+fileName
            }
            pdf.create(document)
            
            const filePath = 'http://localhost:3000/'+fileName;

            res.redirect(filePath)
        }
    })    
})

module.exports = router
const mysql = require('mysql')
const express = require('express')

const Conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '' ,
    database: 'hris'
})

Conn.connect(function(err){
    if(err){
        console.log('Not Connected')
    }else{
        console.log('Connected To Database')
    }
})

module.exports = Conn
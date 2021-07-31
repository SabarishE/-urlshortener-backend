import nodemailer from 'nodemailer'

export var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'one.trial.one.trial@gmail.com',
    pass: process.env.pwd
  }
});


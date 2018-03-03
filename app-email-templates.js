const express = require('express')
const Email = require('email-templates')

const getEmail = async (req, res) => {
    const email = new Email({})
    const locals = {
        name: "Ramon de Klein",
        email: "mail@ramondeklein.nl"
    }
    const html = await email.render("test", locals)
    res.status(400)
    res.set('Content-Type', 'text/html')
    res.send(html)
}

const app = express()
app.get('/', getEmail)
app.listen(3001, () => console.log('Run "curl http://localhost:3001" to generate an "email".'))
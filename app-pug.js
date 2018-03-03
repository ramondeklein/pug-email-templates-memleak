const useGlobalTemplateFunc = false         // Set to 'true' to prevent this issue

const fs = require('fs')
const util = require('util')
const path = require('path')
const express = require('express')
const pug = require('pug')

const readFileAsync = util.promisify(fs.readFile);

let globalTemplateFunc;
const getTemplateFunc = async () => {
    // Obtain the PUG-generated template function that expands the
    // template. When the 'globalTemplateFunc' constant is set, then
    // it reuses the same function over and over again.
    if (globalTemplateFunc) {
        return globalTemplateFunc;
    }
    const template = await readFileAsync(path.join(__dirname, 'emails/test.pug'));
    const templateFunc = pug.compile(template)
    if (useGlobalTemplateFunc) {
        globalTemplateFunc = templateFunc;
    }
    return templateFunc;
}

const getEmail = async (req, res) => {
    try {
        const templateFunc = await getTemplateFunc()
        const locals = {
            name: "Ramon de Klein",
            email: "mail@ramondeklein.nl"
        }
        const html = templateFunc(locals)
        res.status(400)
        res.set('Content-Type', 'text/html')
        res.send(html)
    }
    catch (err) {
        res.status(500)
        res.set('Content-Type', 'text/html')
        res.send(err.message)
    }
}

const app = express()
    .get('/', getEmail)
    .listen(3000, () => console.log('Run "curl http://localhost:3000" to generate an "email".'))
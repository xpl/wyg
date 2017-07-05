/*  Run with:

        > node demo.js
 */

const _         = require ('useless')
const { mkdir } = require ('useless/server/base/fs')

/*
теперь в Useless можно HTTP routes определять просто как мемберы компонента, т.е. было так:

```
WygDemoApp = $singleton (Component, {

    api: function () { return {

        ‘/’:
            this.file.$ (‘./demo.html’),

        ‘api/upload’: {
            post: this.uploadImageTo.$ (‘./upload’) },

        ‘:file’:
            this.file.$ (‘./‘) } },

 ....
 */

WygDemoApp = $singleton (Component, {

    // api () { return {

    //     '/':
    //         this.file.$ ('./demo.html'),

    //     'api/upload': {
    //         post: this.uploadImageTo.$ ('./upload') },

    //     ':file':
    //         this.file.$ ('./')

    // }},

    $depends: [
        
        require ('useless/server/supervisor'),
        require ('useless/server/http'),
        require ('useless/server/uploads'),
        require ('useless/server/source')
    ],

    '/': () => $this.file ('./demo.html'),

    '/api/upload': { post: () => $this.uploadImageAsJPEG ('./upload') },

    '/:file': () => $this.file ('./'),

    shouldRestartOnSourceChange (action, file, yes, no) {
                                    if (file.contains (__dirname + '/upload')) {
                                        no () } },

    async init () {
        
        await mkdir ('upload').catch (() => {})

        log.green ('Example app is running at ', log.color.boldGreen, 'http://localhost:1333')
    }
})
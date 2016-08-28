/*  Run with:

        > node demo.js
 */

require ('useless')

App = $singleton (Component, {

    api: function () { return {

        '/':
            this.file ('./demo.html'),

        'api/upload': {
            post: this.uploadImageTo.$ ('./upload') },

        ':file':
            this.file ('./') } },

    $depends: [
        
        require ('useless/server/supervisor'),
        require ('useless/server/http'),
        require ('useless/server/uploads'),
        require ('useless/server/devtools') ],

    shouldRestartOnSourceChange: function (action, file, yes, no) {
                                    if (file.contains (__dirname + '/upload')) no () },

    init: function () {
            require ('useless/server/base/fs').mkdir ('upload')
            log.green ('Example app is running at ', log.color.boldGreen, 'http://localhost:1333') } })
/*  Run with:

        > node demo.js
 */

require ('useless')

App = $singleton (Component, {

    api: function () { return {

        '/':
            this.file ('./demo.html'),

        'api/upload': {
            post: this.uploadImageTo.$ ('./uploads') },

        ':file':
            this.file ('./') } },

    $depends: [
        
        require ('useless/server/supervisor'),
        require ('useless/server/deploy'),
        require ('useless/server/http'),
        require ('useless/server/uploads'),
        require ('useless/server/devtools') ],


    init: function () {
            require ('useless/server/base/fs').mkdir ('uploads')
            log.green ('Example app is running at ', log.color.boldGreen, 'http://localhost:1333') } })
;(function ($ /* JQUERY */) {

/*  ======================================================================== */

DDContainer_ItemPlaceholder = $trait ({

    $defaults: {
        activePlaceholderSize: Vec2.xy (1920, 1080), // numbers here encode proportions, not actual onscreen size
        restPlaceholderHeight: 40 },

    makeAddIcon: function () {
                    return Node.div.extend ({
                                className: 'wyg-icon',
                                innerHTML: '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  width="216px" height="146px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><path d="M162.18,41.592c-5.595-9.586-13.185-17.176-22.771-22.771c-9.588-5.595-20.055-8.392-31.408-8.392 c-11.352,0-21.822,2.797-31.408,8.392c-9.587,5.594-17.177,13.184-22.772,22.771C48.225,51.179,45.428,61.649,45.428,73 c0,11.352,2.798,21.82,8.392,31.408c5.595,9.585,13.185,17.176,22.772,22.771c9.587,5.595,20.056,8.392,31.408,8.392 c11.352,0,21.822-2.797,31.408-8.392c9.586-5.594,17.176-13.185,22.771-22.771c5.594-9.587,8.391-20.057,8.391-31.408 C170.57,61.648,167.773,51.178,162.18,41.592z M144.5,78.214c0,1.412-0.516,2.636-1.549,3.667c-1.032,1.031-2.254,1.548-3.666,1.548 h-20.857v20.856c0,1.412-0.517,2.635-1.548,3.667c-1.032,1.032-2.254,1.548-3.666,1.548h-10.429c-1.412,0-2.634-0.516-3.666-1.548 c-1.032-1.032-1.548-2.255-1.548-3.667V83.429H76.714c-1.412,0-2.634-0.517-3.666-1.548c-1.032-1.031-1.548-2.255-1.548-3.667 V67.785c0-1.412,0.516-2.634,1.548-3.666c1.032-1.032,2.254-1.548,3.666-1.548h20.858V41.714c0-1.412,0.516-2.634,1.548-3.666 c1.032-1.032,2.254-1.548,3.666-1.548h10.429c1.412,0,2.635,0.516,3.666,1.548c1.031,1.032,1.549,2.254,1.549,3.666v20.857h20.856 c1.412,0,2.634,0.516,3.666,1.548c1.032,1.032,1.548,2.254,1.548,3.666V78.214z"/></svg>' }) },

    /*makeRowPlaceholder: function () {
        return $('<div class="dd-row placeholder">') },*/

    beforeLayout: function () {
                    if (this.itemPlaceholder && !this.itemPlaceholder.hasClass ('drag-accept')) {
                        this.itemPlaceholder.ddData ({ originalSize: Vec2.xy (this.width, this.restPlaceholderHeight) }) } },

    initPlaceholder: function () {
                        $(this.dom).append (
                            this.rowPlaceholder = this.makeRowPlaceholder ().append (
                                this.itemPlaceholder = $('<div class="dd-item placeholder icon-holder" no-history>').append (
                                    this.makeAddIcon ()))) },

    releaseRowPlaceholder: function () {

                                if (this.rowPlaceholder.children ('.dd-item:not(.placeholder)').length) {

                                    /*  Re-attach to appear in DOM mutation history
                                        TODO: get rid of that ugly workaround...
                                        TODO: get rid of jQuery
                                     */
                                    var next =  this.rowPlaceholder[0].nextSibling
                                                this.rowPlaceholder.detach ()
                                                this.rowPlaceholder.removeClass ('placeholder active')[0].noHistory = false
                                                this.el[0].insertBefore (this.rowPlaceholder[0], next)

                                    this.rowPlaceholder = this.makeRowPlaceholder ().appendTo (this.el)
                                    this.layout ({ allowWrite: _.equals (this.rowPlaceholder[0]) }) }

                                else if (this.rowPlaceholder.hasClass ('active')) {

                                    this.rowPlaceholder.removeClass ('active').appendTo (this.el)
                                    this.layout ({ allowWrite: _.equals (this.rowPlaceholder[0]) }) }

                                return this.rowPlaceholder },

    releasePlaceholder: function () {
                            this.moveItem (this.itemPlaceholder.removeClass ('drag-accept'),
                                { row: this.releaseRowPlaceholder () },
                                { write: false }) },

    replacePlaceholderWith: function (item) { item = _.eval (item)

                                if (item && this.itemPlaceholder.hasClass ('drag-accept')) {

                                    /*  This is needed to get rid of placeholder references in DOM mutations history
                                     */
                                    var parentNode = this.itemPlaceholder[0].parentNode
                                        parentNode.insertBefore (item[0], this.itemPlaceholder[0].nextSibling)

                                    if (item.ddData ().size) {

                                        var itemBBox = this.itemBBox (item)
                                        var sourceW  = item.ddData ().size.w 
                                        var targetW  = this.itemPlaceholder.width ()

                                        item.transform ({ scale: 1 })
                                            .css ('transform-origin', '50% 50%')
                                            .css (itemBBox.ltwh)
                                            .animateWith ((sourceW > targetW) ?
                                                        'dd-container-item-placement-mooz' :
                                                            (sourceW < targetW) ?
                                                                'dd-container-item-placement-zoom' : undefined) } }

                                this.releasePlaceholder.postpone () },

    moveItemPlaceholder: function (item, target, cfg) {

                                this.moveItem (this.itemPlaceholder
                                                    .addClass ('drag-accept')
                                                    .ddData ({ originalSize: item ?
                                                                    item.ddData ().originalSize :
                                                                    this.activePlaceholderSize }),
                                               target,
                                               _.extend ({ write: false }, cfg))

                                if (item) {
                                    item.css ({
                                        transform: 'scale(' + (this.itemPlaceholder.width () / item.ddData ().size.w) + ')' }) } } })


/*  ======================================================================== */

}) (jQuery);
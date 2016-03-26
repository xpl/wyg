/*  Front-end API for the WYSIWYG component
    ======================================================================== */

Wyg_ContentAPI = $trait ({

    /*  Defines empty prompt paragraph as default value
     */
    $defaults: {
        value: {
            blocks: [{  type:  'p',
                        html: '<br>' }] } },

    /*  Bind to this to get notified on content modifications
     */
    contentReseted: $trigger (),
    contentChanged: $trigger ($on ('input', function () { this.updateEmptyStatus () })),

    isEmpty: $observableProperty (true, function (value) { this.domReady (function (dom) {
                                                                                    dom.toggleAttribute ('data-empty', value) }) }),


    /*  This is used for testing/debugging purposes, to set/extract legit content use 'value' property (not fully implemented yet)
     */
    html: $property ({
        
        set: function (v) { this.historyReady (function () {
                                this.resetContent (function () { this.el.html (v) }) }) },

        get: function () {  var copy = this.el.clone ().remove ('.dd-placeholder')
                                copy.find ('*[style]').removeAttr ('style')
                         return copy.html () } }),


    /*  Use this API for set/extract proper content value
     */
    value: $property ({

        get: _.notImplemented, // TODO: implement

        set: function (value) {
                this.historyReady (function () {
                    this.resetContent (function () { var $ = jQuery
                        this.supressAnimations (function (done) {
                            this.dom.appendChildren (value.blocks.map (this.renderValueBlock))
                            done.postpone () }) }) }) } }),

    renderValueBlock: function (block) {
                            switch (block.type) {
                                case 'p':
                                    return _.extend (Node.paragraph, { innerHTML: block.html })
                                case 'images':
                                    return $('<p id="dd-demo" class="dd-row" contenteditable="false">').append (
                                        _.map (block.images, function (img) {
                                            return this.initDragForItem ($('<img>').attr (img).ddData ({
                                                originalSize: Vec2.xy (img.width, img.height) })) }, this))[0] } },

    /*  Use this for resetting content with custom fill actions
     */
    resetContent: function (fillActions) {
                                this.dom.removeAllChildren ()
                                this.resetHistory ()
                                this.$ (fillActions) ()
                                this.contentReseted ()
                                this.contentChanged ()
                                this.dom.blur () },

    /*  ...like this (degenerate case)
     */
    clear: function () {
        this.resetContent (_.noop) },


/*  Bindings/impl
    ======================================================================= */

    undoHappened: function () { this.contentChanged () },
    redoHappened: function () { this.contentChanged () },

    paragraphs: $property (function () {
                                return _.filter (this.dom.childNodes, function (n) {
                                    return n.isParagraph &&
                                          !n.isDDPlaceholder }) }),

    updateEmptyStatus: function () {
                            this.isEmpty = _.reduce2 (true, this.paragraphs, function (allEmpty, p) {
                                                                                    var isEmpty = !p.isDDRow && p.isEmptyParagraph
                                                                                        p.toggleAttribute ('data-empty', isEmpty)
                                                                                        return allEmpty && isEmpty }) },


/*  Creates a context within whose all animations are supressed.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    supressAnimations: function (ctx) {
        if (this.dom) {
            this.dom.setAttribute ('noanimate', this.animationsSupressed = (this.animationsSupressed || 0) + 1) }
        ctx.call (this, this.$ (function () {
            if ((this.animationsSupressed = this.animationsSupressed - 1) === 0) {
                if (this.dom) {
                    this.dom.removeAttribute ('noanimate') } } })) },

})
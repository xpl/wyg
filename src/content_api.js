/*  Front-end API for the WYSIWYG component
    ======================================================================== */

Wyg_ContentAPI = $trait ({

    $defaults: {
        value: [] },

    /*  Bind to this to get notified on content modifications
     */
    contentReseted: $trigger (),
    contentChanged: $trigger ($on ('input', function () { })),


    /*  This is used for testing/debugging purposes, to set/extract legit content use 'value' property
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

        get: function () {
                return this.nonemptyParagraphs.map (this.$ (function (p) {
                                                                return p.isDDRow
                                                                            ? { type: 'media', media: p.childNodesArray.map (this.mediaNodeValue) }
                                                                            : { type: 'p', html: p.innerHTML } })) },

        set: function (blocks) {
                this.historyReady (function () {
                    this.resetContent (function () { var $ = jQuery
                        this.supressAnimations (function (done) {
                            this.dom.appendChildren ((_.coerceToUndefined (blocks) || [{ type: 'p', html: '<br>' }]).map (this.renderValueBlock))
                            done.postpone () }) }) }) } }),

    mediaNodeValue: function (n) {
        return _.nonempty (_.extended (n.wygMediaData, {
                                            originalSize: n.ddData.originalSize.asWidthHeight,
                                            relativeSize: { width: n.ddData.size.w / n.parentNode.ddData.innerSize.w,
                                                            height: 1.0 / n.ddData.originalSize.aspect } })) },

    renderValueBlock: function (block) {
                            switch (block.type) {
                                case 'p':
                                    return _.extend (Node.paragraph, { innerHTML: block.html })
                                case 'media':
                                    return Node.paragraph
                                                .cls ('dd-row')
                                                .attr ({ contenteditable: false })
                                                .append (_.map (block.media, this.renderMedia)) } },

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
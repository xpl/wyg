;(function ($ /* JQUERY */) {

/*  ======================================================================== */

Wyg_DDContainerAdapter = $trait ({

/*  Source of a width and height metrics
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    width:  $observableProperty (),
    height: $observableProperty (),


/*  Overrides some DDContainer internals to achieve consistency with
    text editing experience. Need to provide special care about
    autosizing things which are paragraphs.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    layoutParagraphs: function () {
        this.domReady (function () {
                            this.width = this.dom.clientWidth
                            this.dom.safeEnumChildren (this.$ (function (n, i) {
                                                                    if (n.isParagraph && !n.isDDRow) {
                                                                        n.ddData = {
                                                                            originalSize: Vec2.xy (this.width, $(n).extent ().y),
                                                                            margin: 18 } } }))
                            this.layout () }) },

    uploadFile: function (file, then) {
        this.uploadImage (file, function (img) {
            then (img && $('<img>')
                                .css ({ width: 0, height: 0 })
                                .attr ({ 'src': img.src })
                                .ddData ({ src: img.src, originalSize: Vec2.xy (img.width, img.height) })) }) },

    makeRowPlaceholder: function () {
        return $('<p contenteditable="false" class="dd-row placeholder" no-history>') },


/*  Creates a context within whose all animations are supressed.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    supressAnimations: function (ctx) {
        this.dom.setAttribute ('noanimate', this.animationsSupressed = (this.animationsSupressed || 0) + 1)
        ctx.call (this, this.$ (function () {
            if ((this.animationsSupressed = this.animationsSupressed - 1) === 0) {
                this.dom.removeAttribute ('noanimate') } })) },


/*  Binds to isDragging, creating $customCommand context for the entire
    drag operation.

    TODO:   Fix issue when user presses 'undo' too quickly (< 300ms), i.e.
            immediately after drag completes.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    isDragging: function (yes) {
        if (yes) {
            this.execCustomCommand ('drag', function (done) {
                this.isDraggingChange.when (false, function () {              //  close transaction when isDragging comes to false next time...
                    this.layout.onceAfter (done.delayed (300)) }) }) } },     //  ..and after layout() is called


/*  Adds $silent (see total_recall.js) to initPlaceholder
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    initPlaceholder: function () {
        this.silent ('initPlaceholder', this.$ (DDContainer_ItemPlaceholder.prototype.initPlaceholder)) },


/*  Binds to content events to enforce layout consistency
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    interceptDoCaretReturn: function (doCaretReturn) { // fixes Safari-specific layout animation issue
        this.supressAnimations (function (done) {
            doCaretReturn.call (this); done () }) },

    afterInit: function () {
        this.layoutParagraphs.postpone () },

    layoutOnWindowResize: $on ({ target: window, what: 'resize' }, function (e) {
        this.layoutParagraphs ()
        this.layoutParagraphs.postpone () }),

    contentChanged: function () {
        this.layoutParagraphs () },

    contentReseted: function () {
        this.initPlaceholder ()
        this.layoutParagraphs () },

})

/*  ======================================================================== */

}) (jQuery);
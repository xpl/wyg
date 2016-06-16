;(function ($ /* JQUERY */) {

/*  ======================================================================== */

Wyg_DDContainerAdapter = $trait ({

    $defaults: {
        paragraphMargin: 18 },

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
                                                                            margin: this.paragraphMargin } } }))
                            this.layout () }) },

    makeRowPlaceholder: function () {
        return $('<p contenteditable="false" class="dd-row placeholder" no-history>') },
        

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
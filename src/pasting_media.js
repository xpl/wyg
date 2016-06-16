/*  Provides WYSIWYG experience for media links ============================ */

Wyg_PastingMedia = $trait ({

/*  ------------------------------------------------------------------------ */

    $test: function () {

    /*  Example component                                                    */

        var Wyg = $component ({

            $traits: [  Testosterone.LogsMethodCalls,
                        DOMReference,
                        DOMTotalRecall,
                        DOMEvents,

                        DDContainer_ItemPositioning,
                        DDContainer_ItemPlaceholder,
                        DDContainer_HitTesting,
                        DDContainer_DraggingItems,
                        DDContainer_DroppingFiles,

                        ContentEditable_ExecCommand,
                        ContentEditable_UndoRedoDetection,
                        ContentEditable_UndoRedo,
                        ContentEditable_MarkupNormalization,
                        ContentEditable_KeyboardInput,

                        Wyg_MediaIO,
                        Wyg_PastingMedia,
                        Wyg_EmptyState,
                        Wyg_ContentAPI,
                        Wyg_DDContainerAdapter],

        /*  $parseMedia and $renderMedia for custom media types */

            test: $parseMedia (function (url) {
                                    if (url === 'http://test/') {
                                        return {
                                            type: 'dummy',
                                            dummyData: 'hello',
                                            originalSize: Vec2.xy (800, 600) } } }),

            dummy: $renderMedia (function (data) {
                                    return Node.make ('dummy')
                                               .attr ({ data: data.dummyData }) }),

            init: function () {
                    this.domReady (Node.div .toggleAttribute ('contenteditable', true)
                                            .appendTo (document.body)) } })

        $assert (Wyg.supportedMedia.contains ('test'))

    /*  Simulate paste   */

        var wyg = new Wyg ()
            
            wyg.processPaste ({
                preventDefault: _.noop,
                clipboardData: {
                    types: ['text/plain'],
                    items: [{
                        getAsString: _.cps.constant ('http://test/') }] } })

    /*  Check results   */

        return __.delay (1)
                 .then (function () {

                            $assert (wyg.value, [{  type: 'media',
                                                    media: [{
                                                        type: 'dummy',
                                                        dummyData: 'hello',
                                                        originalSize: { width: 800, height: 600 },
                                                        originalUrl: "http://test/",
                                                        relativeSize: { width: 1, height: 0.75 } } ] } ])

                            $assert (wyg.dom.innerHTML, '<p empty="true"><br></p>' +
                                                        '<p class="dd-row" contenteditable="false">' +
                                                            '<dummy data="hello" class="dd-item" appear="true"></dummy>' +
                                                        '</p>')

                            wyg.destroy () })
    },

/*  ------------------------------------------------------------------------ */

    $defaults: {
        allowedTags: {
            a: { href: true,
                 busy: true } } },

/*  Entry point ------------------------------------------------------------ */

    processPaste: $on ('paste', function (e) {
                                    var types = e.clipboardData.types
                                    if (types[0] && types[0] === 'text/plain') {
                                        e.preventDefault () 
                                        e.clipboardData.items[0].getAsString (this.$ (function (txt) {
                                            var parsedURL  = this.parseURL (txt)
                                            if (parsedURL) { this.embedURL (parsedURL.href) }
                                                      else { this.insertText (txt) } })) } }),

/*  ------------------------------------------------------------------------ */

    parseURL: function (txt) {
        if ((txt.indexOf ('http://') === 0) ||
            (txt.indexOf ('https://') === 0)) {
                var parser = document.createElement ('a')
                    parser.href = txt
                if (parser.hostname) { return parser } } },

    embedURL: $log (function (url) {
        var range = Range.current
        if (range &&
           !range.collapsed &&
            range.isWithinNode (this.dom)) {
            this.execCommand ('createLink', url) }
        else {
            var escaped = _.escape (url)
            this.insertHTML ('<a pasted="true" href="' + escaped + '">' + escaped + '</a>')
            this.cleanupEmptyParagraphLeftAfterVideoIsInserted () } }),

/*  ------------------------------------------------------------------------ */

    nodeChanged: function (node) {
        if (node.isHyperlink && node.href && node.getAttribute ('pasted')) {
            if (!node.mediafied) {
                 node.mediafied = true
                 this.mediafyLink (node) } } },

/*  ------------------------------------------------------------------------ */

    mediafyLink: $log (function (a) {
                           a.busyUntil (this.parseMedia (a.href))
                                 .then (this.$ (function (media) {
                                                this.replaceLink (a,
                                                    this.renderMedia (media)) }))
                                 .catch (function (e) {
                                            if (e !== null) { // null means not found
                                                throw e } })
                                 .panic }),

/*  ------------------------------------------------------------------------ */

    replaceLink: $customCommand ($log (function (a, x) {

                                    var p = Node.paragraph
                                        p.className = 'dd-row'
                                        p.setAttribute ('contenteditable', 'false')
                                        x.animateWithAttribute ('appear')
                                        p.appendChild (x)
                                        p.insertMeBefore (this.dom.splitSubtreeBefore (a))
                                        a.removeFromParent ()

                                    /*  Manually call this to restore prompt paragraph if needed.

                                        When inserting links into empty editor it leaves no empty
                                        paragraph left immediately after the procedure. And before
                                        the markup normalization occurs (which normally restores
                                        the prompt paragraph) the undo/redo detection algorithm needs
                                        to insert its so-called "trap" somewhere (see undo_redo_detection.js for details).

                                        Probably we should somehow generalize the prompt paragraph
                                        restoring, so it will be guaranteed that at the emitUndoTrap
                                        stage we always have that prompt paragraph set up.            */

                                        if (this.cleanupParagraphs) {
                                            this.cleanupParagraphs () } })),

/*  Fixes nasty glitch, happens for unknown reason...
    This is simple workaround ---------------------------------------------- */

    cleanupEmptyParagraphLeftAfterVideoIsInserted: $customCommand (function () {
                                                        var p = this.currentParagraph
                                                        if (p &&
                                                            p.isEmptyParagraph) { p.removeFromParent () } }),

})




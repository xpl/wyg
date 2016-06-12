/*  Provides WYSIWYG experience for media links ============================ */

Wyg_PastingMedia = $trait ({

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
                                            if (parsedURL) { this.embedURL (parsedURL) }
                                                      else { this.insertText (txt) } })) } }),

/*  ------------------------------------------------------------------------ */

    parseURL: function (txt) {
        if ((txt.indexOf ('http://') === 0) ||
            (txt.indexOf ('https://') === 0)) {
                var parser = document.createElement ('a')
                    parser.href = txt
                if (parser.hostname) { return parser } } },

    embedURL: function (url) {
        var range = Range.current
        if (range &&
           !range.collapsed &&
            range.isWithinNode (this.dom)) {
            this.execCommand ('createLink', url) }
        else {
            var escaped = _.escape (url)
            this.insertHTML ('<a pasted="true" href="' + escaped + '">' + escaped + '</a>')
            this.cleanupEmptyParagraphLeftAfterVideoIsInserted () } },

/*  ------------------------------------------------------------------------ */

    nodeChanged: function (node) {
        if (node.isHyperlink && node.href && node.getAttribute ('pasted')) {
            if (!node.mediafied) {
                 node.mediafied = true
                 this.mediafyLink (node) } } },

/*  ------------------------------------------------------------------------ */

    mediafyLink: function (a) {
                           a.busyUntil (this.parseMedia (a.href)
                                 .then (this.$ (function (media) {
                                                this.replaceLink (a,
                                                    this.renderMedia (media)) }))).panic },

/*  ------------------------------------------------------------------------ */

    replaceLink: $customCommand (function (a, x) {
                                    var p = Node.paragraph
                                        p.className = 'dd-row'
                                        p.setAttribute ('contenteditable', 'false')
                                        x.animateWithAttribute ('appear')
                                        p.appendChild (x)
                                        p.insertMeBefore (this.dom.splitSubtreeBefore (a))
                                        a.removeFromParent () }),

/*  Fixes nasty glitch, happens for unknown reason...
    This is simple workaround ---------------------------------------------- */

    cleanupEmptyParagraphLeftAfterVideoIsInserted: $customCommand (function () {
                                                        var p = this.currentParagraph
                                                        if (p &&
                                                            p.isEmptyParagraph) { p.removeFromParent () } }),

})




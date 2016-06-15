/*  Handling empty state
    ======================================================================= */

Wyg_EmptyState = $trait ({

    isEmpty: $observableProperty (true, function (value) {
                                            this.domReady (function (dom) {
                                                                     dom.toggleAttribute ('empty', value) }) }),

    nonemptyParagraphs: $property (function () {
                                    return _.reject (this.paragraphs, _.property ('isEmptyParagraph')) }),

    updateEmptyState: function () {
                            this.isEmpty = _.reduce2 (true, this.paragraphs, function (allEmpty, p) {
                                                                                    var isEmpty = !p.isDDRow && p.isEmptyParagraph
                                                                                        p.toggleAttribute ('empty', isEmpty)
                                                                                        return allEmpty && isEmpty }) },

    contentChanged: function () { this.updateEmptyState () } })


/*  Node.isEmptyParagraph
    ======================================================================= */

$mixin (Node, {

    isEmptyParagraph: $property (function () {
        return this.noChildren ||
             ((this.childNodes.length === 1) && this.firstChild.isLinebreak) }) })

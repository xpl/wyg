;(function ($ /* JQUERY */) {

/*  ======================================================================== */

DDContainer_DroppingFiles = $trait ({

    makeWaitIcon: function () {
                    return N.div.extend ({
                                className: 'wyg-icon',
                                innerHTML: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"> <path d="M15.05,11.888c-0.268-0.055-0.535,0.118-0.59,0.39c-0.426,2.082-2.281,3.594-4.41,3.594c-2.481,0-4.5-2.019-4.5-4.5 c0-2.649,1.851-4.5,4.5-4.5c0.554,0,1.383,0.002,2.051,0.005L9.361,8.975c-0.22,0.168-0.261,0.481-0.093,0.7 c0.098,0.129,0.247,0.196,0.396,0.196c0.106,0,0.214-0.033,0.304-0.104l3.78-2.896c0.123-0.095,0.197-0.242,0.195-0.398 c0-0.156-0.074-0.304-0.199-0.397l-3.78-2.847c-0.219-0.164-0.532-0.123-0.7,0.099c-0.166,0.221-0.122,0.534,0.099,0.7l2.454,1.848 c-0.609-0.002-1.29-0.004-1.768-0.004c-3.187,0-5.5,2.313-5.5,5.5c0,3.032,2.468,5.5,5.5,5.5c2.602,0,4.869-1.848,5.391-4.393 C15.495,12.208,15.321,11.943,15.05,11.888z"/></svg>' }) },
                    
    domReady: function () {
        this.el.addClass ('allow-file-drop') },

    domDragOver: $on ('dragenter dragover', function (e) { if (this.isValidDragEvent (e)) {

        this.isDragging = true
        this.el.addClass ('dragging-file')

        var offset = this.el.offset ()

        var hit = this.hitTest ({
            x: e.pageX - offset.left,
            y: e.pageY - offset.top })

        if (!hit.equals (this.prevHit)) {
            this.dragItemTo (undefined, this.prevHit = hit) } }

        e.preventDefault ()
        e.stopPropagation () }),

    domDragLeave: $on ('dragleave', function (e) {

        if (e.target === this.el[0]) {
            this.prevHit = undefined
            this.el.removeClass ('dragging-file')
            this.isDragging = false
            this.releasePlaceholder.postpone () }

        e.preventDefault ()
        e.stopPropagation () }),

    domDrop: $on ('drop', function (e) { if (this.isValidDragEvent (e)) {

            this.prevHit = undefined

            var addingToSameRow = this.itemPlaceholder[0].nextSibling ? true : false

            _.each (e.dataTransfer.files, function (file) {
                                                            this.itemPlaceholder.addClass ('drag-accept')
                                                            this.putFileToPlaceholder (file)
                                                            if (!addingToSameRow) {
                                                                this.releasePlaceholder () } }, this)

            this.el.removeClass ('dragging-file')
            this.isDragging = false }

        e.preventDefault ()
        e.stopPropagation () }),

    isValidDragEvent: function (e) {
                        return ((e.dataTransfer.files && (e.dataTransfer.files.length > 0)) ||
                                (e.dataTransfer.types &&  e.dataTransfer.types.contains ('Files')) ) },

    putFileToPlaceholder: function (file) {

        var withFileUpload = this.$ (function (file, target) { return this.$ (function () {

            this.uploadFile (file).done (this.$ (function (e, el) {

                if (el) {
                    this.initDragForItem (el)
                            .animateWith ('appear')
                            .removeAttr ('no-history')
                            .insertBefore (target) }

                target.remove ()

                this.layout.postpone ()
                this.contentChanged () })).panic

            return target }) })

        this.replacePlaceholderWith (withFileUpload (file,
            this.initDragForItem ($('<div class="upload-stub icon-holder" no-history>')
                .ddData ({ originalSize: this.activePlaceholderSize })
                .animateWith ('appear')
                .append (this.makeWaitIcon ()))))

        this.layout.postpone () } })


/*  ======================================================================== */

}) (jQuery);
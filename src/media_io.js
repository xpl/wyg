/*  ------------------------------------------------------------------------ */

Tags.define ('parseMedia')
Tags.define ('renderMedia')

/*  ------------------------------------------------------------------------ */

Wyg_MediaIO = $trait ({

/*  ------------------------------------------------------------------------ */

    parseMedia: $log (function (url) {

                /*  Gather values from all methods tagged with $parseMedia   */

                    var values = _.map (this.constructor.$membersByTag.parseMedia,
                                            function (def, name) {
                                                return this[name] (url) || Promise.reject (null) }, this)
                
                    return Promise.firstResolved (values)
                                  .then (function (media) {
                                            return _.extend (media, { originalUrl: url }) }) }),

    $parseMedia: {

        images: function (url) {
                    return Image.fetch (url)
                                .then (function (img) {
                                        return { type: 'img',
                                                  src:  url,
                                         originalSize: { width: img.width,
                                                        height: img.height } } }) },

        youtube: function (url) {
                    var match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)
                    var id = match && (match[7].length === 11) && match[7]
                    if (id) {
                        return {
                            type: 'iframe',
                             src: '//www.youtube.com/embed/' + id + '?wmode=transparent',
                    originalSize: { width: 16000,
                                   height: 9000 } } } },
    },

    supportedMedia: $static ($property (function () {
                        return _.keys (this.$membersByTag.parseMedia) })),

/*  ------------------------------------------------------------------------ */

    renderMedia: $log (function (media) {

                    var n = this[media.type] (media)

                        n.wygMediaData = media
                        n.ddData       = { originalSize: Vec2.fromWH (media.originalSize) }

                    return this.initDragForItem (n)[0] }),

    $renderMedia: {

        img: function (media) {
                return N.img.attr ({ src: media.src, width: media.originalSize.width, height: media.originalSize.height }) },

        iframe: function (media) {
                    return N.div.append (
                           N.iframe.attr ({ src: media.src, frameborder: 0, allowfullscreen: true })) } },


})
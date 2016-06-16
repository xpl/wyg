
/*  Reference implementation of the file uploading.
    ======================================================================== */

Wyg_FileUploading = $trait ({

    $defaults: {
        uploadPath: 'upload' },

    uploadFile: function (file, then) {
                    return JSONAPI.uploadFile (this.uploadPath, file).then (this.$ (function (response) {
                        return this.renderMedia ({ type: 'img',
                                                    src: '/' + this.uploadPath + '/' + response.id + '.jpg',
                                           originalSize: { width: response.w,
                                                          height: response.h } }) })).panic },

    preventsPageReloadWhenDroppingFile: $on ({ what: 'drop', target: document },
                                            function (e) {
                                                e.preventDefault () }),
})
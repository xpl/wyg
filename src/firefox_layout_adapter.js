Wyg_FirefoxLayoutAdapter = !Platform.Firefox ? $trait () : $trait ({

/*  Firefox has nasty resizing handles for absolute-positioned elements
    contained within a contenteditable. There's no way to disable them.

    The workaround is to turns off absolute layout when dragging is not
    active. This disables fancy paragraph sliding animations when typing
    text, and should be considered as a temporary work-around.

    Will wait until Firefox implements grabber styling/disabling.
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    domReady: function (dom) {
        dom.toggleAttribute ('static-layout', true) },

    isDragging: function (yes) {
        this.domReady (function (dom) {
            dom.toggleAttribute ('static-layout', !yes) }) }
})
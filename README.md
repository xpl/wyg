# Wyg Editor

A new WYSIWYG editing experience for the modern web.
First public beta (still many bugs to fix). Docs are pending.

- Built entirely from scratch
- Works better than anything before
- Minimalistic UI, blazingly fast (works with DOM nodes directly)
- Normalizes entered markup on the fly (splits paragraphs with linebreaks)
- Smart linebreak management (no Shift-Enter required to put a newline)
- Drag & drop media between paragraphs
- Insert media by simply pasting links into text
- Arranges media nicely in columns
- Fluid layout with animations
- Floating markup panel with custom tags support
- Custom undo/redo manager (works with arbitrary DOM changes)
- Intercepts native undo/redo commands (not limited to hotkeys)
- [Test-driven](https://www.youtube.com/watch?v=IWLE8omFnQw)

Watch demo on YouTube: [youtube.com/watch?v=u1wNfSHwSQA](https://www.youtube.com/watch?v=u1wNfSHwSQA)

## TODO

In it's current state the stuff is quite unusable. Things to be done:

- Safari compatibility (some tests fail).
- MS Edge compatibility.
- Implement hyperlink editing in the floating markup panel.
- Fix nonworking plus button (should trigger file open dialog).
- Add build script.

## Running demo

You will need `node` and `npm`.

1. Clone repo with `git clone http://github.com/xpl/wyg`
2. Run `npm install` to install dependencies.
3. Run `node demo.js`
4. Open `localhost:1333` in Chrome (Safari / Firefox / Edge support is coming)

### Updating demo

Instead of `git pull`, use `./update.sh` (runs `git pull && npm update`). This is needed because it's dependencies change rapidly and you need to update all shit together to maintain consistency.

## Under the hood

Everything is built upon a JS library called [Useless.js](https://github.com/xpl/useless) (working title). It delivers composable [traits](https://github.com/xpl/useless/wiki/%24trait) support to JavaScript and a powerful unit test system. You may read more about it in the [project's wiki](https://github.com/xpl/useless/wiki).

## Adding support of new media types

All incoming URLs that are pasted from clipboard go through `parseMedia` facility. This function converts URLs to abstract media definitions in JSON format. Those definitions, when serialized, can be easily stored/interpreted by external applications (e.g. template engines, when rendering to static HTML at server side).

Example:

```javascript
this.parseMedia ('https://www.youtube.com/watch?v=JQ0qgyCuoCw')
    .then (x => console.log (x))
```

Rendered output will be:

```javascript
{ type: 'iframe',
  src:   '...',
  originalUrl: 'https://www.youtube.com/watch?v=JQ0qgyCuoCw',
  originalSize: { width: ..., height: ... } }
```

This is then feeded to the media rendering facility, which processes those definitions, producing DOM elements:

```javascript
this.renderMedia (def) // produces DOM element from that definition
```

Both functions can be extended to introduce new behavior. This is how you do that.

### Extending `parseMedia`

Tag a method with **$parseMedia** to designate it as an URL parser. For asynchronous parsing, you can return Promise:

```javascript
images: $parseMedia (function (url) {
            return Image.fetch (url)
                        .then (function (img) {
                                return { type: 'img',
                                          src:  url,
                                 originalSize: { width: img.width,
                                                height: img.height } } }) }),
```

```javascript
youtube: $parseMedia (function (url) {
            var match = url.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)
            var id = match && (match[7].length == 11) && match[7]
            if (id) {
                return {
                    type: 'iframe',
                     src: '//www.youtube.com/embed/' + id + '?wmode=transparent',
            originalSize: { width: 16000, // numbers here encode aspect ratio + max size (not actual onscreen size)
                           height: 9000 } } } }),
```

You can also use tag groups (a feature of every **$prototype**) to reduce clutter in case of many parser methods:

```javascript
$parseMedia: {
    images: ...
    youtube: ...
    vimeo: ...
    soundcloud: ... }
```

You can query what types are supported by checking static `supportedMedia` property. It will be generated from method names:

```javascript
MyEditor.supportedMedia // ['images', 'youtube', ...]
```

For those who are curious, here's the actual implementation of the `parseMedia` factory:

```javascript
parseMedia: function (url) {

    /*  Gather values from all methods tagged with $parseMedia   */

        var values = _.map (this.constructor.$membersByTag.parseMedia,
                                function (def, name) {
                                    return this[name] (url) || Promise.reject (null) }, this)
    
        return Promise.firstResolved (values)
                      .then (function (media) {
                                return _.extend (media, { originalUrl: url }) }) },
```

### Extending `renderMedia`

This is done much the same way as with the former one:

```javascript
img: $renderMedia (function (media) {
        return Node.img.attr ({ src: media.src,
                              width: media.originalSize.width,
                             height: media.originalSize.height }) }),

iframe: $renderMedia (function (media) {
            return Node.div.append (
                   Node.iframe.attr ({ src: media.src, frameborder: 0, allowfullscreen: true })) } }),
```

Those methods are dispatched by looking into the `type` property in media definitions.

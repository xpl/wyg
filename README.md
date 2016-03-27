# Wyg Editor

A new WYSIWYG editing experience for the modern web.
First public beta (still many bugs to fix). Docs are pending.

- Built entirely from scratch
- Works better than anything before
- Minimalistic UI, blazingly fast (works with DOM nodes directly)
- Normalizes entered markup on the fly (splits paragraphs with linebreaks)
- Smart linebreak management (no Shift-Enter required to put a newline)
- Drag & drop media between paragraphs
- Arranges media nicely in columns
- Fluid layout with animations
- Pasted links get converted to media blocks instantly
- Floating markup panel with custom tags support
- Custom undo/redo manager (works with arbitrary DOM changes)
- Intercepts native undo/redo commands (not limited to hotkeys)

Watch demo on YouTube: [youtube.com/watch?v=u1wNfSHwSQA](https://www.youtube.com/watch?v=u1wNfSHwSQA)

## TODO

In it's current state the stuff is quite unusable. Things to be done:

- Fix critical bugs in drag & drop interaction.
- Safari compatibility (some tests fail).
- MS Edge compatibility.
- Implement hyperlink editing in the floating markup panel.
- JSON serialization

## Running demo

You will need `node` and `npm`.

1. Clone repo with `git clone http://github.com/xpl/wyg`
2. Run `npm install` to install dependencies.
3. Run `node demo.js`

### Updating demo

Instead of `git pull`, use `./update.sh` (runs `git pull && npm update`). This is needed because it's dependencies change rapidly and you need to update all shit together to maintain consistency.

## Under the hood

Everything is built upon a JS library called [Useless.js](https://github.com/xpl/useless) (working title). It delivers composable [traits](https://github.com/xpl/useless/wiki/%24trait) support to JavaScript and a powerful unit test system. You may read more about it in the [project's wiki](https://github.com/xpl/useless/wiki).

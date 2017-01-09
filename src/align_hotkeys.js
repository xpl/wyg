/*  Allows to change paragraph alignment with Alt + ←/→   */

Wyg_AlignHotkeys = $trait ({

    $defaults: {
        allowedTags: {
            p: { align: true }
        }
    },

    processHotkeyAlignment: $on ('keydown', function (e) {

        const p = this.currentParagraph

        if (p) {

            const alignments = ['', 'center', 'right']

            const direction = e.altKey && (e.key === 'ArrowRight') ? 1 :
                                         ((e.key === 'ArrowLeft') ? -1 : 0)

            if (direction !== 0) {
                
                this.execCustomCommand ('align', done => {

                    const align = p.getAttribute ('align') || ''

                    p.setAttribute ('align',
                        alignments.itemAtWrappedIndex (alignments.indexOf (align) + direction))

                    done ()
                })

                e.preventDefault ()
            }
        }
    })
})
Wyg_InsertingParagraphs = $trait ({

	domReady (dom) {

		dom.on ('click', e => {

			if (e.target === dom) { // clicked on empty space

				const hit = this.hitTest (Vec2.xy (e.offsetX, e.offsetY)) // analyze hit
				const row = hit.row && hit.row[0]
				
				if (row.isDDRow && hit.side_v) {

					const hasNextTextRow = (row.nextSibling && row.nextSibling.isTextRow)
					const hasPrevTextRow = (row.prevSibling && row.prevSibling.isTextRow)

					if (!(hit.side_v === 'bottom' && hasNextTextRow) &&
						!(hit.side_v === 'top'    && hasPrevTextRow)) {

						this.insertPromptParagraph (hit)
					}
				}
			}
		})
	},

	insertPromptParagraph: $customCommand (function (hit) {

		N ('p', N ('br'))
				[{ bottom: 'insertMeAfter', top: 'insertMeBefore' }[hit.side_v]] (hit.row[0])
				.moveCaret ()

	})
})
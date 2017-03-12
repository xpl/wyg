Wyg_InsertingParagraphs = $trait ({


	domReady (dom) {

		dom.on ('click', e => {

			if (e.target === dom) { // clicked on empty space

				const hit = this.hitTest (Vec2.xy (e.offsetX, e.offsetY)) // analyze hit
				const row = hit.row && hit.row[0]
				
				if (row.isDDRow && (hit.side_v === 'bottom') && !(row.nextSibling && row.nextSibling.isTextRow)) {

					//log.gg (true)

				}

			}
		})
	}
})
import { describe, expect, it } from 'vitest'

import { SECTION_ORDER } from './content'
import { navItems } from './ui-strings'

describe('navItems', () => {
  it('segue a ordem em que a página monta as seções', () => {
    // The bar is a shortlist, so it may skip sections — but never reorder
    // them. Presentes sat before Estadia while the page put Estadia first,
    // which meant clicking rightwards along the bar walked back up the page.
    const order = navItems.map((item) => SECTION_ORDER.indexOf(item.anchor as never))
    expect(order).toEqual([...order].sort((a, b) => a - b))
  })

  it('só aponta para seções que existem', () => {
    for (const item of navItems) {
      expect(SECTION_ORDER).toContain(item.anchor)
    }
  })
})

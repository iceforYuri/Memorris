import { visit } from 'unist-util-visit'

/** Map mdast `highlight` nodes to HTML `<mark>` (remark-highlight-mark does not set hName). */
export function remarkHighlightMarkHast() {
  return (tree) => {
    visit(tree, 'highlight', (node) => {
      const data = node.data || (node.data = {})
      data.hName = 'mark'
    })
  }
}

import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import App from './App'
import Header from './containers/Header'
import Dashboard from './containers/Dashboard'

const setup = propOverrides => {
  const renderer = createRenderer()
  renderer.render(<App />)
  const output = renderer.getRenderOutput()
  return output.props.children[0]
}

describe('components', () => {
  describe('Header', () => {
    it('should render', () => {
      const output = setup()
      const [header] = output.props.children
      expect(header.type).toBe(Header)
    })
  })

  describe('Dashboard', () => {
    it('should render', () => {
      const output = setup()
      const [, mainSection] = output.props.children
      expect(mainSection.type).toBe(Dashboard)
    })
  })
})

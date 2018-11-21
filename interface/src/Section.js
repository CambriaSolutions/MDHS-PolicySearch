import React, { PureComponent } from 'react'
import SectionHeader from './SectionHeader'
import styled from 'styled-components'

const Container = styled.div`
  flex: 0 1 0px;
  width: 100%;
`

const Matches = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: ${p => (p.active || !p.open ? '20px' : '5px')};
  max-height: ${p => (p.active || !p.open ? '1500px' : '0px')};
  opacity: ${p => (p.active || !p.open ? '1' : '0')};
  overflow: hidden;
  transition: all 0.15s ease-in-out;
`

class Section extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { active: true }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const newState = !this.state.active
    this.setState({ active: newState })
  }

  render() {
    const { open, section, pages } = this.props
    const { active } = this.state
    return (
      <Container>
        {open ? (
          <SectionHeader
            active={active}
            onClick={this.handleClick}
            section={section}
          />
        ) : null}
        <Matches active={active} open={open}>
          {pages}
        </Matches>
      </Container>
    )
  }
}

export default Section

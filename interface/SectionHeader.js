import React, { PureComponent } from 'react'
import styled from 'styled-components'
import UpArrow from '@material-ui/icons/KeyboardArrowUp'

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 12px 18px 12px 24px;
  align-items: center;
  background: #19212b;
  border-bottom: 1px solid rgb(64, 72, 84);
  border-radius: 0px;
  cursor: pointer;
  user-select: none;
`
const Header = styled.div`
  flex: 1;
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  font-family: 'Google Sans', sans-serif;
  line-height: 1.2rem;
  text-transform: capitalize;
  -webkit-font-smoothing: antialiased;
`

const ArrowUp = styled(UpArrow)`
  && {
    font-size: 28px;
    transform: ${p => (p.active ? 'null' : 'rotate(-180deg)')};
    transition: transform 0.15s linear;
    color: rgba(255, 255, 255, 0.7);
    &:hover {
      color: white;
    }
  }
`

class SectionHeader extends PureComponent {
  render() {
    return (
      <Container onClick={this.props.onClick}>
        <Header>{this.props.section} </Header>
        <ArrowUp active={this.props.active ? 1 : 0} />
      </Container>
    )
  }
}

export default SectionHeader

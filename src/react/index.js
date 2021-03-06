import { createElement, Component, cloneElement } from 'react'
import PropTypes from 'prop-types'

let observer
const STATE = Object.freeze({
  ERROR: -1,
  INIT: 0,
  LOADING: 1,
  LOADED: 2
})

export default class Miyuri extends Component {
  constructor(props) {
    super(props)
    this.state = { load: STATE.INIT }
    this.loadImage = this.loadImage.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.onError = this.onError.bind(this)
    this.onPlaceholderLoad = this.onPlaceholderLoad.bind(this)
  }
  componentDidMount() {
    if (!observer) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
              observer.unobserve(entry.target)
              let miyuriNode = entry.target.miyuriNode
              miyuriNode.setState({ load: STATE.LOADING })
              miyuriNode.loadImage()
            }
          })
        },
        { rootMargin: '50px 0px' }
      )
    }
    this.domNode && (this.domNode.miyuriNode = this)
    if (typeof this.props.placeholder === 'object') {
      observer.observe(this.domNode)
    }
  }
  componetnWillUnmount() {
    observer.unobserve(this.domNode)
    if (this.img) {
      delete this.img.onerror
      delete this.img.onload
      delete this.img.src
      delete this.img
    }
  }

  loadImage() {
    this.img = new Image()
    this.img.src = this.props.src
    this.img.onload = this.onLoad
    this.img.onerror = this.onError
  }

  onLoad() {
    if (this.img) {
      this.setState({ load: STATE.LOADED })
    }
  }

  onPlaceholderLoad() {
    observer.observe(this.domNode)
  }

  onError() {
    if (this.img) {
      this.setState({ load: STATE.ERROR })
    }
  }

  render() {
    const props = this.props
    const load = this.state.load
    const imgProps = objectWithoutProperties(props, [
      'placeholder',
      'errorholder'
    ])

    switch (load) {
      case STATE.LOADED:
        return createElement('img', imgProps)
      case STATE.INIT:
      case STATE.LOADING: {
        if (!props.placeholder) {
          return createElement('img', imgProps)
        } else if (typeof props.placeholder === 'string') {
          imgProps.src = props.placeholder
          imgProps.ref = c => (this.domNode = c)
          imgProps.onLoad = this.onPlaceholderLoad
          return createElement('img', imgProps)
        } else {
          return cloneElement(this.props.placeholder, {
            ref: c => (this.domNode = c)
          })
        }
      }
      case STATE.ERROR: {
        if (!props.errorholder) {
          return createElement('img', imgProps)
        } else if (typeof props.errorholder === 'string') {
          imgProps.src = props.errorholder
          return createElement('img', imgProps)
        } else {
          return this.props.errorholder
        }
      }
      default:
        return null
    }
  }
}

Miyuri.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errorholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

/* utils */
/* 由于microbundle暂时不支持"object rest spread"，暂时这样解决。 */
function objectWithoutProperties(obj, props) {
  const result = {}
  for (let prop in obj) {
    props.indexOf(prop) >= 0 ||
      (Object.prototype.hasOwnProperty.call(obj, prop) &&
        (result[prop] = obj[prop]))
  }
  return result
}

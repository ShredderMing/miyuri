let observer
const STATE = Object.freeze({
  ERROR: -1,
  INIT: 0,
  LOADING: 1,
  LOADED: 2
})
export default {
  name: 'miyuri',
  props: {
    src: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    errorholder: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    state: STATE.INIT
  }),
  computed: {
    hasPlaceholderSlot() {
      return !!this.$slots['placeholder']
    },
    hasErrorHolderSlot() {
      return !!this.$slots['errorholder']
    },
    domNode() {
      if (this.$refs.placeholder) {
        return this.$refs.placeholder
      } else if (this.hasPlaceholderSlot) {
        return this.$slots.placeholder[0].elm
      } else {
        return null
      }
    }
  },
  methods: {
    loadImage() {
      this.img = new Image()
      this.img.src = this.src
      this.img.onload = this.onLoad
      this.img.onerror = this.onError
    },
    onLoad() {
      if (this.img) {
        this.state = STATE.LOADED
      }
    },
    onPlaceholderLoad() {
      observer.observe(this.domNode)
    },
    onError() {
      if (this.img) {
        this.state = STATE.ERROR
      }
    }
  },
  render(h) {
    switch (this.state) {
      case STATE.LOADED:
        return h('img', { attrs: { src: this.src } })
      case STATE.INIT:
      case STATE.LOADING: {
        if (!this.placeholder) {
          if (this.hasPlaceholderSlot) {
            return this.$slots.placeholder[0]
          }
          return h('img', { attrs: { src: this.src } })
        } else {
          return h('img', {
            attrs: { src: this.placeholder },
            on: { load: this.onPlaceholderLoad },
            ref: 'placeholder'
          })
        }
      }
      case STATE.ERROR: {
        if (!this.errorholder) {
          if (this.hasErrorHolderSlot) {
            return this.$slots.errorholder[0]
          }
          return h('img', { attrs: { src: this.src } })
        } else {
          return h('img', { attrs: { src: this.errorholder } })
        }
      }
      default:
        return null
    }
  },
  mounted() {
    if (!observer) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
              observer.unobserve(entry.target)
              let miyuriNode = entry.target.miyuriNode
              miyuriNode.state = STATE.LOADING
              miyuriNode.loadImage()
            }
          })
        },
        { rootMargin: '50px 0px' }
      )
    }
    this.domNode && (this.domNode.miyuriNode = this)
    if (this.hasPlaceholderSlot) {
      observer.observe(this.domNode)
    }
  },
  beforeDestroy() {
    observer.unobserve(this.domNode)
    if (this.img) {
      delete this.img.onerror
      delete this.img.onload
      delete this.img.src
      delete this.img
    }
  }
}

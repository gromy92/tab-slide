<template>
    <div class="tab">
        <div :class="['tab-wrap',tabIsOverFlow?'scroll':'no-scroll']">
            <ul class="tab-slide-wrap" @touchstart="_touchTabStart" @touchmove="_touchTabMove" @touchend="_touchTabEnd" rel="tab">
                <li v-for="(item,index) in tabData" :class="['tab-item',slideIndex===index?'active':'']" :style="{width:tabItemWidth+'px'}" :key="index" :id="index" >
                    <span>{{item}}</span>
                </li>
            </ul>
            <div class="slide-border" :style="{width:tabSliderWidth+'px'}"></div>
        </div>
        <div class="content-wrap">
            <div class="content-slide-wrap" @touchstart="_touchStart" @touchmove="_touchMove" @touchend="_touchEnd">
                <slot>
                </slot>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    @import './assets/index.scss';
</style>
<script>
import { ScreenWidth } from './consts'
export default {
  name: 'tab-slide',
  components: {
  },
  props: {
    start: {
      type: Number,
      default: 0
    },
    overFlowScroll: {
      type: Boolean,
      default: false
    },
    tabWidth: { // overFlowScroll为true时候 tabWidth生效,
      type: Number,
      default: 80
    },
    tabSliderWidthPercent: {
      type: Number,
      default: 0.8
    }
  },
  data () {
    return {
      slideIndex: this.start,
      initTabStyle: {
        width: 0
      },
      startX: 0, // 触摸位置
      moveX: 0, // 滑动时的位置
      disX: 0, // 移动距离
      startY: 0, // 触摸位置
      moveY: 0, // 滑动时的位置
      disY: 0, // 移动距离

      startTX: 0, // 触摸位置
      moveTX: 0, // 滑动时的位置
      disTX: 0, // 移动距离
      tabData: [],
      tabOffsetLeftStart: 0,
      tabMoveDis: 0,
      moveTimer: null,
      tabSpeed: 0, // tab move结束后初速度
      startTabTime: 0

    }
  },
  computed: {
    tabItemWidth () {
      if (this.tabData.length > 0) {
        console.log('computed-itemWidth:' + ScreenWidth / this.tabData.length)
        if (this.tabIsOverFlow) {
          return this.tabWidth
        }
        return ScreenWidth / this.tabData.length
      }
    },
    tabSliderWidth () {
      return this.tabItemWidth * this.tabSliderWidthPercent
    },
    tabIsOverFlow () {
      if (this.overFlowScroll && this.tabData.length * this.tabWidth >= ScreenWidth) {
        return true
      }
      return false
    },
    tabScrollRightMax () {
      return screen.width - $('.tab-slide-wrap').width()
    }
  },
  watch: {
    startTX (value) {
      this.tabOffsetLeftStart = $('.tab-slide-wrap').offset().left
    },
    tabMoveDis (value) {
      console.log('----tabMoveDis------------:' + value)
      if (value >= 0) {
        clearTimeout(this.moveTimer)
        $('.tab-slide-wrap').css({ 'transform': 'translateX(0px)' })
      } else if (value <= this.tabScrollRightMax) {
        let dis = this.tabScrollRightMax
        clearTimeout(this.moveTimer)
        $('.tab-slide-wrap').css({ 'transform': 'translateX(' + dis + 'px)' })
      } else {
        $('.tab-slide-wrap').css({ 'transform': 'translateX(' + value + 'px)' })
      }
    }
  },

  mounted () {
    this.transFormSlideTab(this.start)
    this.transFormContentItem(this.start, null)
  },
  methods: {
    tabSlideCreated (label) {
      console.log(label + '----')
      this.tabData.push(label)
    },

    slideTab (index) {
      //  ev.preventDefault();
      this.$emit('changeSlide', index)
      this.slideIndex = index
      this.transFormSlideTab(index)
      this.transFormContentItem(index, null)
    },

    // tab栏动画
    transFormSlideTab (index) {
      if (this.tabIsOverFlow) {
        this.scrollTabBar()
      } else {
        console.log('tab-width' + $('.slide-border').width())
        let slideTabWidth = (index + 0.5) * this.tabItemWidth - this.tabSliderWidth / 2
        console.log('slideTabWidth' + slideTabWidth)
        $('.slide-border').css({ 'transform': 'translateX(' + slideTabWidth + 'px)' })
      }
    },
    // tab条滑动
    scrollTabBar () {
      let len
      let disTab
      let disBorder
      disBorder = (1 - 0.8) / 2 * this.tabWidth
      len = this.calSlideLen()
      let center = this.tabData.length / 2
      console.log('------scrollTabBar----------:' + center)
      if (this.slideIndex <= center) {
        if (len < (this.slideIndex + 1)) {
          disTab = -this.tabWidth * (this.slideIndex - len)
          disBorder += this.tabWidth * len
        } else {
          disTab = 0
          disBorder += this.tabWidth * this.slideIndex
        }
      } else {
        if (this.tabData.length > (this.slideIndex + len + 1)) {
          disTab = -this.tabWidth * (this.slideIndex - len)
          disBorder += this.tabWidth * len
        } else {
          disTab = -(this.tabWidth * this.tabData.length - screen.width)
          disBorder += screen.width - this.tabWidth * (this.tabData.length - this.slideIndex)
        }
      }
      this.tabMoveDis = disTab
      console.log('scrollTabBar:' + disTab + ' slideIndex:' + this.slideIndex)
      $('.slide-border').css({ 'transform': 'translateX(' + disBorder + 'px)' })
    },
    // 计算滑动后的active index
    calCurrIndex () {
      let index
      index = -parseInt(this.disTX / this.tabWidth)
      index = this.slideIndex + index
      if (this.disTX > 0) {
        index -= 1
      } else {
        index += 1
      }
      if (index < 0) {
        index = 0
      } else if (index > this.tabData.length - 1) {
        index = this.tabData.length - 1
      }

      this.slideIndex = index
      console.log('------calCurrIndex---------:' + this.slideIndex)
    },
    // 计算tab滚动定位是否在中间  中间的位置需要滑动tab
    calSlideLen () {
      console.log('calTabInCenter:' + this.slideIndex)
      let slideLen = 0
      let screenContLen = parseInt(ScreenWidth / this.tabWidth)

      slideLen = parseInt(screenContLen / 2)
      console.log('slideLen:' + slideLen)
      return slideLen
    },
    // panel内容动画
    transFormContentItem (index, srcElement) {
      // $('.content-item').css('height', 0);
      let disX = 0
      if (index == null) {
        disX = this.disX
        if (this.slideIndex === this.tabData.length - 1 && disX > 0) {
          return
        }
        if (this.slideIndex === 0 && disX < 0) {
          return
        }
      }
      console.log('disX' + disX + 'disY' + this.disY)
      // if (Math.abs(disX) - Math.abs(this.disY) > 0) {
      let slideContWidth = -index * $('.content-item').width()
      console.log('slideContWidth' + slideContWidth)
      let y = 0
      // $('.content-slide-wrap').css({ 'transform': 'translateX(' + slideContWidth + 'px)' });
      //    $('html,body').animate({scrollTop:0})
      $('.content-slide-wrap').css({ 'transform': 'translate3d(' + slideContWidth + 'px,' + y + 'px,0px)' })
    },
    _touchTabStart (ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        this.startTX = ev.touches[0].clientX
        this.startTY = ev.touches[0].clientY
        this.startTabTime = new Date().getTime()
      }
    },
    _touchTabMove (ev) {
      ev = ev || event
      this.moveTX = ev.touches[0].clientX
      // 滑动过程中实时计算滑动距离
      this.disTX = parseInt(this.moveTX - this.startTX)
      this.tabMoveDis = this.tabOffsetLeftStart + this.disTX
    },

    _touchTabEnd (ev) {
      ev.preventDefault()
      if (Math.abs(this.disTX) < 10) {
        let id = ev.target.id || $(ev.target).parent().attr('id')
        this.slideTab(parseInt(id))
        return
      }
      if (!this.tabIsOverFlow) {
        return
      }
      this.calCurrIndex()
      this.slideTab(this.slideIndex)
      this.tabSpeed = this.disTX / (new Date().getTime() - this.startTabTime)
      console.log('--------tabSpeed-----------' + this.tabSpeed)
      this.disTX = 0
      return true
    },
    _touchStart (ev) {
      ev = ev || event
      // ev.preventDefault();
      if (ev.touches.length === 1) {
        this.startX = ev.touches[0].clientX
        this.startY = ev.touches[0].clientY
      }
    },

    _touchMove (ev) {
      ev = ev || event
      // ev.preventDefault();
      this.moveX = ev.touches[0].clientX
      this.moveY = ev.touches[0].clientY
      // 滑动过程中实时计算滑动距离

      // console.log('moveX'+'***'+ this.moveX+'moveY'+'***'+ this.moveY)
      this.disX = parseInt(this.moveX - this.startX)
      this.disY = parseInt(this.moveY - this.startY)
      // console.log('disX' + '***' + this.disX + 'disY' + '***' + this.disY)
      if (Math.abs(this.disX) - Math.abs(this.disY) > 0) {
        ev.preventDefault()
      }
    },
    _touchEnd (ev) {
      // 滑动过程中的实时位置
      //  ev.preventDefault();
      if (Math.abs(this.disX) - Math.abs(this.disY) > 0) { // 横向滑动
        ev.preventDefault()
      } else {
        return true
      }
      let index
      if (this.disX < 0) {
        if (this.slideIndex + 1 === this.tabData.length) {
          return true
        }
        index = this.slideIndex + 1
        this.slideTab(index)
      } else {
        if (this.slideIndex === 0) {
          return true
        }
        index = this.slideIndex - 1
        this.slideTab(index)
      }
      return true
    }
  }
}
</script>

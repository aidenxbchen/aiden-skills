# OpenArm.dev 网站高级动画技术分析

> 来源: https://openarm.dev  
> 技术栈: Nuxt 3 + Vue 3 + PixiJS + Splide + Lenis

---

## 1. 滚动动画 (Scroll Animations)

### Lenis 平滑滚动
```html
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.29/dist/lenis.min.js"></script>
```
```css
html.lenis, html.lenis body { height: auto }
.lenis.lenis-smooth { scroll-behavior: auto !important }
```
- 使用 **Lenis** 库实现高性能平滑滚动
- 支持滚动锚点和动量滚动

### 滚动驱动动画 (Scroll-driven)
```css
/* Header 滚动模糊背景 */
.header .backdrop {
  backdrop-filter: blur(calc(3/var(--design-width)*100vw));
  background: linear-gradient(114deg, #ffffff1a, #fff3);
}
```

---

## 2. 视差效果 (Parallax Effects)

### 背景视差层
```css
#wrapper .bd {
  background: #011414;
  position: absolute;
  width: calc(1/var(--design-width)*100vw);
  z-index: -1;
}
/* 多层视差定位 */
.bd1 { left: calc(119/var(--design-width)*100vw) }
.bd2 { left: calc(519/var(--design-width)*100vw) }
.bd3 { left: calc(919/var(--design-width)*100vw) }
.bd4 { left: calc(1319/var(--design-width)*100vw) }
```

---

## 3. 毛玻璃效果 (Glassmorphism)

```css
.header .backdrop {
  backdrop-filter: blur(calc(3/var(--design-width)*100vw));
  background: linear-gradient(114deg, #ffffff1a, #fff3);
  border-radius: calc(8/var(--design-width)*100vw);
}

.features .card_filter {
  backdrop-filter: blur(calc(6/var(--design-width)*100vw));
  background: linear-gradient(180deg, #02161900 0%, #02161933 23.71%, #01474866 50.65%, #0792b599 80.07%, #5fbbc7cc 94.12%, #a2d6cf 102.07%);
}
```

---

## 4. SVG 路径动画 (SVG Path Animations)

### 零件爆炸图标注线
```html
<svg viewBox="0 0 4 100" class="path-svg" fill="none">
  <path d="M0,100 L0,0" stroke="white" stroke-width="2"></path>
  <circle cx="0" cy="100" r="2" fill="white"></circle>
  <circle cx="0" cy="0" r="2" fill="white"></circle>
</svg>
```
- 使用 SVG 绘制连接线和端点
- 配合 Canvas 实现 3D 模型爆炸视图

---

## 5. 视频背景 (Video Background)

```html
<div class="Kv">
  <div class="video">
    <video src="/videos/kv.mp4" muted playsinline autoplay loop></video>
  </div>
</div>
```
```css
.Kv .video video {
  height: 100%;
  object-fit: cover;
  width: 100%;
}
```

---

## 6. Canvas/WebGL 动画 (PixiJS)

```html
<div class="pixi-sequence-container">
  <!-- 使用 PixiJS 渲染 3D 模型序列帧 -->
</div>
```
- 使用 **PixiJS** 渲染机器人 3D URDF 模型
- 支持交互式 3D 可视化

---

## 7. CSS 渐变动画 (Gradient Animations)

### 按钮悬停渐变
```css
.Btn:before {
  background: url(/_nuxt/btn_bg.png) no-repeat 50%/cover;
  opacity: 1;
  transition: opacity .3s ease;
}
.Btn:hover:before { opacity: .8 }
```

### 文字渐变高亮
```css
.number {
  background: linear-gradient(180deg, #0792b5 20%, #5fbbc7 60%, #d3f9f4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

---

## 8. 遮罩动画 (Mask Animations)

```css
.features {
  -webkit-mask-image: linear-gradient(#fff,#fff), url(/images/round_mask.svg) no-repeat center bottom/contain;
  mask-image: linear-gradient(#fff,#fff), url(/images/round_mask.svg) no-repeat center bottom/contain;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.JoinOurCommunity .slider {
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent 0, #000 10%, #000 90%, transparent);
}
```

---

## 9. 悬停交互动画 (Hover Effects)

### 箭头滑入效果
```css
.Btn .arrow {
  transition: transform .3s cubic-bezier(.645,.045,.355,1);
}
.Btn:hover .arrow {
  transform: translate(120%);
}
```

### 菜单项颜色过渡
```css
.header .nav .menu .item .link {
  transition: color .3s ease;
}
.header .nav .menu .item .link:hover {
  color: #5fbbc7;
}
```

### 汉堡菜单动画
```css
.menuTrigger span:first-child { transform: translateY(calc(8/var(--design-width)*100vw)) }
.menuTrigger.isMenuOpen span:first-child {
  rotate: 45deg;
  transform: translateY(0);
}
```

---

## 10. 轮播图 (Splide Carousel)

```html
<section class="splide">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">...</li>
    </ul>
  </div>
</section>
```
- 使用 **Splide.js** 库
- 支持触摸滑动和键盘导航

---

## 11. 表单交互动画

### 输入框下划线动画
```css
.LetsGetinTouch .input {
  transition: all 0.3s ease;
}
.LetsGetinTouch .underline {
  background: #5fbbc7;
  height: 1px;
  will-change: transform, opacity, filter;
  transition: transform 0.3s ease;
}
.LetsGetinTouch .input:focus + .underline {
  transform: scaleX(1);
}
```

### 下划线生长效果
```css
.LetsGetinTouch .input:focus ~ .underline {
  animation: underlineGrow 0.3s ease forwards;
}
@keyframes underlineGrow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

---

## 12. 模糊过渡 (Blur Transitions)

```css
.Model .blur-visualizer {
  filter: none;
  transition: filter .5s ease-out;
}
.Model .blur-visualizer.on-blur {
  filter: blur(.0035rem);
  pointer-events: none;
}
```

---

## 13. 响应式断点动画

```css
@media(min-width: 1024px) {
  .header { height: calc(64/var(--design-width)*100vw); }
}
@media(max-width: 1023px) {
  .header {
    height: calc(60/var(--design-width)*100vw);
    transition: height .3s cubic-bezier(.645,.045,.355,1) .2s;
  }
  .header.isMenuOpen {
    height: calc(390/var(--design-width)*100vw);
  }
}
```

---

## 14. 渐变背景动画

```css
.gradient_circle {
  background: url(/images/gradient_circle.webp) no-repeat 50%/cover;
  animation: pulse 10s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}
```

---

## 15. 打字机/计数器动画

> 网站中数字使用渐进式加载动画（需要配合 JS）

```javascript
// 伪代码示例
function animateNumber(el, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}
```

---

## 16. 社区轮播无缝滚动

```css
.slider-inner {
  display: flex;
  animation: scroll 20s linear infinite;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

---

## 17. 响应式设计动画技巧

### CSS 变量驱动动画
```css
:root {
  --design-width: 375; /* 移动端 */
}
@media(min-width: 1024px) {
  :root {
    --design-width: 1440; /* 桌面端 */
  }
}
/* 所有尺寸使用相对单位 */
.title {
  font-size: calc(40/var(--design-width)*100vw);
}
```

---

## 动画库总结

| 用途 | 库/技术 |
|------|---------|
| 平滑滚动 | **Lenis** |
| 轮播图 | **Splide.js** |
| 3D 渲染 | **PixiJS** + URDF Viewer |
| 动画过渡 | **CSS Transitions/Animations** |
| 视差效果 | **CSS transforms** + JS |
| 模糊效果 | **backdrop-filter** |

---

## 关键配色

- 主色: `#5fbbc7` (青色)
- 背景: `#011414` (深墨绿)
- 渐变: `linear-gradient(114deg, #000202, #00434c80 59.62%, #00e2ff66)`

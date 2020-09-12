<template>
  <div @mousemove="mousemove" class="annotation-container" :id="'annotation-canvas-' + name">
    <slot></slot>
    <div class="annotation">
      <img :src="$withBase('/pointer-white.svg')" title="Hover for information" style="width: 50px; height: 50px;" />
    </div>
    <p v-if="this.debug">
      {{ x }} , {{ y }}
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      annotations: [],
      canvas: null
    }
  },
  props: ['name', 'debug', 'color'],
  mounted() {
    this.annotations = this.$frontmatter.annotations[this.name];
    this.canvas = document.getElementById('annotation-canvas-' + this.name);
    for (let i = this.annotations.length - 1; i >= 0; i--) {
      this.mountAnnotation(this.annotations[i])
    }
    // instruction
    let div = document.createElement("div");
    div.className = 'hover-here';
    div.style.right = "50px";
    div.style.top = "40px";
    div.style.animation = 'none';
    this.canvas.appendChild(div)
  },
  methods: {
    mountAnnotation(obj) {
      obj.info = this.canvas.appendChild(this.getInfo(obj));
      obj.box = this.canvas.appendChild(this.getAnnotationBox(obj));
      obj.hoverHere = this.canvas.appendChild(this.getHoverHere(obj));
    },
    getInfo(obj) {
      let div = document.createElement("div");
      div.className = 'annotation-info';
      div.style.left = (obj.x) + "px";
      div.style.top = (obj.y + obj.height + 10) + "px";
      div.style.minWidth = obj.width;
      div.style.maxWidth = '400px';
      div.innerHTML = obj.value;
      return div
    },
    getAnnotationBox(obj) {
      let div = document.createElement("div");
      div.className = 'annotation-box';
      div.style.left = (obj.x) + "px";
      div.style.top = (obj.y) + "px";
      div.style.width = (obj.width) + "px";
      div.style.height = (obj.height) + "px";
      div.style.borderColor = this.color;
      if (this.debug) {
        div.style.display = 'block';
      }
      return div
    },
    getHoverHere(obj) {
      let div = document.createElement("div");
      div.className = 'hover-here';
      div.style.left = (obj.x + obj.width - (25)) + "px";
      div.style.top = (obj.y + (obj.height / 2) - (25/2) + 1) + "px";
      // let point = document.createElement("div");
      // point.className = 'hover-point';
      // div.appendChild(point);
      return div
    },
    mousemove: function (e) {
      if (!this.canvas) {
        return
      }
      let bounds = this.canvas.getBoundingClientRect();
      this.x = e.clientX - bounds.left;
      this.y = e.clientY - bounds.top;

      for (let i = 0; i < this.annotations.length; i++) {
        let a = this.annotations[i]
        if (this.x > a.x && this.x < (a.x + a.width) && this.y > a.y && (this.y < (a.y + a.height))) {
          a.box.style.display = 'block';
          a.info.style.display = 'block';
          a.hoverHere.style.display = 'none';
        } else {
          a.box.style.display = 'none';
          a.info.style.display = 'none';
          a.hoverHere.style.display = 'block';
        }
      }
    }
  }
}
</script>
<style>
  .annotation-info {
    display: none;
    background-color: #ffffff;
    padding: 10px;
    position: absolute;
    z-index: 1000;
  }

  .annotation-box {
    cursor: pointer;
    display: none;
    border: 1px solid white;
    position: absolute;
  }

  .hover-here {
    cursor: pointer;
    display: inline-block;
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background: radial-gradient(#2c3e50, #6a8bad);
    position: absolute;
    animation: blinker 5s linear infinite;
  }

  .hover-point {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 5px;
    width: 5px;
    border: 1px solid white;
    border-radius: 50%;
    transform: translate(-50%,-50%);
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .annotation-container {
    position: relative;
  }

  .annotation-container .annotation {
    border-radius: 50%;
    position: absolute;
    top: 35px;
    right: 35px;
    z-index: 999;
  }
</style>

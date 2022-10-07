import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Pydoc from '../components/Pydoc.vue'
import Tree from '../components/Tree.vue'
import pydocData from '../pydoc'
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.globalProperties.$pydocData = pydocData;
    app.component('Pydoc', Pydoc);
    app.component('Tree', Tree);
  }
}


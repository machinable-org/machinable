import{_ as n,o as a,c as s,t as i,H as r}from"./framework.4afe7240.js";const c={props:["caption"],computed:{spec(){let t=this.$slots.default?this.$slots.default()[0].children:"<undefined>";return t in this.$pydocData?this.$pydocData[t]:{kind:"unknown",name:t,path:t}},label(){if(this.caption)return this.caption;let t=this.spec.path;return this.spec.kind=="routine"&&(t=t+"()"),t.startsWith("machinable.")&&(t=t.substring(11)),t}}};function o(t,l,p,h,d,e){return a(),s("a",{href:"#",style:r(e.spec.kind=="unknown"?{color:"red"}:{})},i(e.label),5)}const f=n(c,[["render",o]]);export{f as P};

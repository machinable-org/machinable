import{_ as h,P as _,o as c,c as s,e as d,r as p,d as f}from"./app.6a92d9d2.js";const u={data(){let n=[];for(let r in this.$pydocData){const e=r.split(".");let i=n,o=e[0];for(let t=0;t<e.length;t++){let a=i.find(l=>l.id==e[t]);a||(a={id:e[t],path:o+"."+e[t],label:e[t],children:[]},i.push(a)),i=a.children,t>0&&(o+="."+e[t])}}return{items:n.find(r=>r.id=="machinable").children,filter:""}},components:{Pydoc:_}};function m(n,r,e,i,o,t){const a=p("Tree");return c(),s("div",null,[d(a,{items:o.items},null,8,["items"])])}const x=h(u,[["render",m]]),T=f("",3),P=JSON.parse('{"title":"Reference documentation","description":"","frontmatter":{},"headers":[{"level":2,"title":"API","slug":"api","link":"#api","children":[]}],"relativePath":"reference/index.md"}'),b={name:"reference/index.md"},v=Object.assign(b,{setup(n){return(r,e)=>(c(),s("div",null,[T,d(x)]))}});export{P as __pageData,v as default};
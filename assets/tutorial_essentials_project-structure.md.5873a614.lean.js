import{_ as o,o as p,c as i,a,b as s,e as n,w as t,d as l,r}from"./app.6a92d9d2.js";const b=JSON.parse('{"title":"Project structure","description":"","frontmatter":{},"headers":[{"level":2,"title":"Creating experiments","slug":"creating-experiments","link":"#creating-experiments","children":[]},{"level":2,"title":"The module convention","slug":"the-module-convention","link":"#the-module-convention","children":[]},{"level":2,"title":"Verify your setup","slug":"verify-your-setup","link":"#verify-your-setup","children":[]}],"relativePath":"tutorial/essentials/project-structure.md"}'),c={name:"tutorial/essentials/project-structure.md"},y=a("h1",{id:"project-structure",tabindex:"-1"},[s("Project structure "),a("a",{class:"header-anchor",href:"#project-structure","aria-hidden":"true"},"#")],-1),u=a("h2",{id:"creating-experiments",tabindex:"-1"},[s("Creating experiments "),a("a",{class:"header-anchor",href:"#creating-experiments","aria-hidden":"true"},"#")],-1),m=a("em",null,"experiments",-1),D=l("",8),h=l("",5);function d(F,C,A,g,f,_){const e=r("Pydoc");return p(),i("div",null,[y,u,a("p",null,[s("At a basic level, machinable projects are regular Python projects that implement "),m,s(". Think of an experiment as some code we would like to run to gain some insights, say a simulation of evolutionary biology or data analysis to estimate the gravity of an exoplanet. In machinable projects, such experiment code is implemented in classes that inherit from the "),n(e,null,{default:t(()=>[s("machinable.Experiment")]),_:1}),s(" base class.")]),D,a("p",null,[s("And here is the module-convention equivalent using "),n(e,null,{default:t(()=>[s("machinable.get")]),_:1}),s(":")]),h])}const x=o(c,[["render",d]]);export{b as __pageData,x as default};
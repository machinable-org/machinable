import{_ as t,o as p,c as r,a,b as s,d as e,w as l,e as o,r as c}from"./app.d50a5abc.js";const k=JSON.parse('{"title":"Storage and retrieval","description":"","frontmatter":{},"headers":[{"level":2,"title":"Configuring the storage","slug":"configuring-the-storage","link":"#configuring-the-storage","children":[]},{"level":2,"title":"Organize using groups","slug":"organize-using-groups","link":"#organize-using-groups","children":[]},{"level":2,"title":"Saving and loading data","slug":"saving-and-loading-data","link":"#saving-and-loading-data","children":[{"level":3,"title":"Records","slug":"records","link":"#records","children":[]}]},{"level":2,"title":"Retriving experiments","slug":"retriving-experiments","link":"#retriving-experiments","children":[]},{"level":2,"title":"Singletons","slug":"singletons","link":"#singletons","children":[]}],"relativePath":"tutorial/essentials/storage-and-retrieval.md"}'),i={name:"tutorial/essentials/storage-and-retrieval.md"},F=o("",5),D=a("code",null,"machinable.storage.filesystem",-1),y=o("",12),d=o("",11),g=o("",1),A=a("code",null,"estimate_gravity",-1),h=a("code",null,"time_dilation",-1),u=a("code",null,"2.0",-1),C=a("code",null,"estimate_gravity",-1),m=a("code",null,"time_dilation=2.0",-1),_=a("p",null,[s("This feature is crucially important for machinable's "),a("a",{href:"./unified-representation.html"},"unified representation"),s(" which we will discuss next.")],-1);function f(v,b,x,E,T,S){const n=c("Pydoc");return p(),r("div",null,[F,a("p",null,[s("This will instantiate the "),e(n,null,{default:l(()=>[s("machinable.Storage")]),_:1}),s(" implementation located in the "),D,s(" module.")]),y,a("p",null,[s("While machinable automatically stores crucial information about the experiment, you can use "),e(n,null,{default:l(()=>[s("machinable.Experiment.save_data")]),_:1}),s(" and "),e(n,null,{default:l(()=>[s("machinable.Experiment.load_data")]),_:1}),s(" to easily store and retrieve additional custom data in different file formats:")]),d,a("p",null,[s("Alternatively, and perhaps more importantly, you can look up experiments in a way that mirrors their original instantiation using "),e(n,null,{default:l(()=>[s("machinable.Experiment.singleton")]),_:1}),s(".")]),g,e(n,{caption:"singleton()"},{default:l(()=>[s("machinable.Experiment.singleton")]),_:1}),s(" will search and return an experiment of type "),A,s(" with a "),h,s(" of "),u,s(". If "),C,s(" has not been executed with that exact configuration, a new instance of the experiment with "),m,s(" is returned instead."),_])}const P=t(i,[["render",f]]);export{k as __pageData,P as default};
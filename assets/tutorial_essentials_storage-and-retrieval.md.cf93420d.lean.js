import{_ as t,o as p,c as r,b as a,d as s,e as l,w as e,a as o,r as c}from"./app.50325a60.js";const k=JSON.parse('{"title":"Storage and retrieval","description":"","frontmatter":{"next":"Continue with the tutorial"},"headers":[{"level":2,"title":"Configuring the storage","slug":"configuring-the-storage","link":"#configuring-the-storage","children":[]},{"level":2,"title":"Saving and loading data","slug":"saving-and-loading-data","link":"#saving-and-loading-data","children":[{"level":3,"title":"Records","slug":"records","link":"#records","children":[]}]},{"level":2,"title":"Organize using groups","slug":"organize-using-groups","link":"#organize-using-groups","children":[]},{"level":2,"title":"Advanced search","slug":"advanced-search","link":"#advanced-search","children":[]}],"relativePath":"tutorial/essentials/storage-and-retrieval.md"}'),i={name:"tutorial/essentials/storage-and-retrieval.md"},y=o("",4),F=a("code",null,"estimate_gravity",-1),D=a("code",null,"time_dilation",-1),d=a("code",null,"2.0",-1),A=a("code",null,"estimate_gravity",-1),g=a("code",null,"time_dilation=2.0",-1),h=o("",5),C=a("code",null,"machinable.storage.filesystem",-1),u=o("",4),m=o("",26);function f(_,v,b,x,E,w){const n=c("Pydoc");return p(),r("div",null,[y,a("p",null,[s("Here, "),l(n,{caption:"get()"},{default:e(()=>[s("machinable.get")]),_:1}),s(" will automatically search the storage for an experiment of type "),F,s(" with a "),D,s(" of "),d,s(". If "),A,s(" has not been executed with this exact configuration, a new instance of the experiment with "),g,s(" is returned instead. This means that we can easily retrieve experiments with the same command we initially used to execute them. Consider the following example:")]),h,a("p",null,[s("This will instantiate the "),l(n,null,{default:e(()=>[s("machinable.Storage")]),_:1}),s(" implementation that is located in the "),C,s(" module, namely the default storage that writes all data to a local directory.")]),u,a("p",null,[s("While machinable automatically stores crucial information about the experiment, you can use "),l(n,null,{default:e(()=>[s("machinable.Experiment.save_data")]),_:1}),s(" and "),l(n,null,{default:e(()=>[s("machinable.Experiment.load_data")]),_:1}),s(" to easily store and retrieve additional custom data in different file formats:")]),m])}const S=t(i,[["render",f]]);export{k as __pageData,S as default};

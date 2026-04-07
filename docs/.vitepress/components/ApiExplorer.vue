<template>
    <div>
        <!--<input type="text" v-model="filter" placeholder="Filter" style="padding: 4px; border: 1px solid #333;" />-->
        <Tree :items="items" />
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import Tree from './Tree.vue'

const instance = getCurrentInstance()
const pydocData = instance.appContext.config.globalProperties.$pydocData

let dataModel = [];
for (let path in pydocData) {
    const s = path.split('.')
    let target = dataModel;
    let p = s[0]
    for (let i = 0; i < s.length; i++){
        let child = target.find(k => k.id == s[i]);
        if (!child) {
            child = {
                id: s[i],
                path: p + '.' + s[i],
                label: s[i],
                children: [],
            }
            target.push(child)
        }
        target = child.children;
        if (i > 0) {
            p += '.' + s[i]
        }
    }
}
const machinableNode = dataModel.find(k => k.id == 'machinable')
const items = machinableNode ? machinableNode.children : dataModel
</script>

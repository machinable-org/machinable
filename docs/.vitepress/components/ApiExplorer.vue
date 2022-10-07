<template>
    <div>
        <!--<input type="text" v-model="filter" placeholder="Filter" style="padding: 4px; border: 1px solid #333;" />-->
        <Tree :items="items" />
    </div>
</template>

<script>
import Pydoc from "./Pydoc.vue"
export default {
    data() {
        let dataModel = [];
        for (let path in this.$pydocData) {
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
        return {
            items: dataModel.find(k => k.id == 'machinable').children,
            filter: ''
        }
    },
    components: {
        Pydoc
    }
}
</script>

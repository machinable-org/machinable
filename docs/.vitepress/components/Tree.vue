<template>
    <ul>
        <li v-for="item in items">
            <Pydoc :caption="item.id">{{ item.path }}</Pydoc>
            <tree v-if="item.children && item.children.length > 0" :items="item.children"/>
        </li>
    </ul>
</template>
<script>
export default {
    props: ['items']
}
</script>
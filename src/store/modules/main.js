export default {
    namespaced: true,
    state:{
        items: [
            {title: 'Заметки', icon: 'mdi-lightbulb-outline', link: '/notes'},
            {title: 'Редактирование ярлыков', icon: 'create', link: '/edit'},
        ],
        loader:true
    },
    getters:{
        items(state){
            return state.items
        },
        loader(state){
            return state.loader
        }
    },
    mutations:{
        changeLoader(state, val){
            state.loader = val
        },
        addLinkIntoItem(state, {name, labelId}){
            let index = state.items.findIndex(x => x.label===labelId)
            if(index === -1){
                state.items.splice(3, 0, {
                    title: name,
                    icon: 'label',
                    link: `/label/${labelId}`,
                    label: labelId
                })
            }
        },
        clearLinks(state){
            state.items = [
                {title: 'Заметки', icon: 'mdi-lightbulb-outline', link: '/notes'},
                {title: 'Редактирование ярлыков', icon: 'create', link: '/edit'},
            ]
        },
        deleteLinkFromItem(state, labelId){
            state.items.forEach(el=>{
                if(el.label && el.label === labelId){
                    const index = state.items.map(e => e.label).indexOf(el.label)
                    state.items.splice(index, 1)

                }
            })
        },
        updateLinkFromItem(state, {updateName, labelId}){
            state.items.forEach(el=>{
                if(el.label && el.label === labelId){
                    const index = state.items.map(e => e.label).indexOf(el.label);
                    state.items[index].title = updateName
                }
            })
        },
    },
    actions:{
        addLabelsToLinks({getters, commit }, labels){
            for(const el of labels){
                let name = el.name
                let labelId = el.id
                commit('addLinkIntoItem', {name, labelId})
            }
        },
        addLabelToLinks({commit}, label){
          let name = label.name
          let labelId = label.id
          commit('addLinkIntoItem',{name, labelId})
        },
        deleteLabelFromLinks({commit}, labelId){
            commit('deleteLinkFromItem', labelId)
        },
        updateLabelFromLinks({commit}, {updateName, labelId}){
            commit('updateLinkFromItem', {updateName, labelId})
        },
    }
}

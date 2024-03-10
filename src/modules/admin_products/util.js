// =====dataTable headers=====
export const headers=[
    {
        title:'S/N',
        key:'sno',
        sortable:false,
        align:"center"
    },
    {
        title:'Title',
        key:'title',
        sortable:true,
        align:"center"
    },
    {
        title:'Price',
        key:'price',
        sortable:true,
        align:"center"
    },
    {
        title:'Category',
        key:'category',
        sortable:true,
        align:"center"
    },
    {
        title:'Actions',
        key:'action',
        sortable:false,
        align:'center'
    }
];
// ======================================

// ======product category with color======
export function getProductStatusClass(status){
    switch(status){
        case "men's clothing":
            return 'green';
        case "jewelery":
            return "yellow"
        case "electronics":
            return 'pink';
        default:
            return 'red'

    }
}
// =======================================


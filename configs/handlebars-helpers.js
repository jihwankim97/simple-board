module.exports={
    lengthOfList:(List=[])=>list.length,
    eq:(val1, val2)=>val1===val2,
    dateString:(isoString)=>new Date(isoString).toLocaleDateString(),
}
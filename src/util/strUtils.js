export function toLine(str){
    return str.replace(/([A-Z])/g,"_$1").toLowerCase();
}

export function toCamelCase(str) {
    return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
    );
}
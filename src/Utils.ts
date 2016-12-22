export function camelCase(str: string) {
    let DEFAULT_REGEX = /[-_]+(.)?/g;
    function toUpper(match, group1) {
        return group1 ? group1.toUpperCase() : "";
    }
    return str.replace(DEFAULT_REGEX, toUpper);
}
export function timeout(ms: Number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

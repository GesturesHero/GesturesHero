function _makeLogFunction(log) {
    return (text) => {
        const now = new Date();
        log(`[${now.toISOString()}] ${text}`);
    };
}

const log = {
    debug: _makeLogFunction(console.log),
    info: _makeLogFunction(console.info),
    warn: _makeLogFunction(console.warn),
    error: _makeLogFunction(console.error)
};

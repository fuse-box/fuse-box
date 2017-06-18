class DummyXMLHTTPRequest {
    constructor() {

    }
    open(methodName, url) {
        this.url = url;
    }
    setRequestHeader() {}
    send() {
        var self = this;
        if (window.__ajax) {
            window.__ajax(this.url, (status, responseText) => {
                self.onreadystatechange.bind({
                    readyState: 4,
                    status: status,
                    statusText: status === 404 ? "Not Found" : null,
                    responseText: responseText
                })()
            })
        }
    }
    getResponseHeader(req) {
        if (req === "Content-Type" && this.url) {
            if (this.url.match(/\.js$/)) {
                return "text/javascript"
            }
            if (this.url.match(/\.json$/)) {
                return "text/json"
            }
            if (this.url.match(/\.css$/)) {
                return "text/css"
            }
        }
    }
}
window.XMLHttpRequest = DummyXMLHTTPRequest;
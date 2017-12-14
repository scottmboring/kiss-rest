import {Signal, Property} from "kiss-events";

class Rest {

    constructor(root = "", headers = {}) {
        this.root = root;
        this.headers = headers;
        this.any = new Signal();
        this.unauthenticated = new Signal();
    }

    get(path = "", headers = {}) {
        let mergedHeaders = Object.assign({}, this.headers, headers);
        let config = {method: "GET", headers: mergedHeaders};
        let result = new RestResult(fetch(this.root + path, config));
        result.any(response => this.any.trigger(response));
        result.unauthenticated(response => this.unauthenticated.trigger(response));
        return result;
    }

    put(body, path = "", headers = {}) {
        let mergedHeaders = Object.assign({}, this.headers, headers);
        let config = {method: "PUT", headers: mergedHeaders, body: body};
        let result = new RestResult(fetch(this.root + path, config));
        result.any(response => this.any.trigger(response));
        result.unauthenticated(response => this.unauthenticated.trigger(response));
        return result;
    }

    post(body, path = "", headers = {}) {
        let mergedHeaders = Object.assign({}, this.headers, headers);
        let config = {method: "POST", headers: mergedHeaders, body: body};
        let result = new RestResult(fetch(this.root + path, config));
        result.any(response => this.any.trigger(response));
        result.unauthenticated(response => this.unauthenticated.trigger(response));
        return result;
    }

    delete(path = "", headers = {}) {
        let mergedHeaders = Object.assign({}, this.headers, headers);
        let config = {method: "DELETE", headers: mergedHeaders};
        let result = new RestResult(fetch(this.root + path, config));
        result.any(response => this.any.trigger(response));
        result.unauthenticated(response => this.unauthenticated.trigger(response));
        return result;
    }
}

class RestResult {
    constructor(promise = null) {
        this.promise = new Property(promise);
    }

    start(callback) {
        callback();
        return this;
    }

    end(callback) {
        this.any(response => callback());
        return this;
    }

    any(callback) {
        this.promise.ready(promise => promise.then(
            response => callback(response),
            error => callback(error)));
        return this;
    }

    anyError(callback) {
        this.promise.ready(promise => promise.then(response => {
                if (response.status >= 300) {
                    callback(response);
                }
            },
            error => callback(error)));
        return this;
    }

    anyErrorText(callback) {
        this.anyError(response => response.text().then(text => callback(text)));
        return this;
    }

    success(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status < 300) {
                callback(response);
            }
        }));
        return this;
    }

    notFound(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 404) {
                callback(response);
            }
        }));
        return this;
    }

    error(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 500) {
                callback(response);
            }
        }));
        return this;
    }

    errorText(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 500) {
                response.text().then(text => callback(text));
            }
        }));
        return this;
    }

    badArgument(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 400) {
                callback(response);
            }
        }));
        return this;
    }

    badArgumentText(callback) {
        this.badArgument(response => response.text().then(text => callback(text)));
        return this;
    }

    unauthenticated(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 401) {
                callback(response);
            }
        }));
        return this;
    }

    text(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 200) {
                response.text().then(result => callback(result));
            }
        }));
        return this;
    }

    json(callback) {
        this.promise.ready(promise => promise.then(response => {
            if (response.status === 200) {
                response.json().then(result => callback(result));
            }
        }));
        return this;
    }
}

export default Rest;
export {RestResult}
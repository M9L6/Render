export class HttpRequest {
    public static loadImageAsync(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject): void => {
            const img = new Image();
            img.src = url;
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject(new Error("Could not load image  at " + url));
            };
        });
    }

    public static loadTextFileAsync(url: string): Promise<string> {
        return new Promise((resolve, reject): void => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.onreadystatechange = (evt: Event): any => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(xhr.responseText);
                }
            };
            xhr.open("get", url, true, null, null);
            xhr.send();
        });
    }

    public static laodArrayBufferAsync(url: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject): void => {
            const xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onreadystatechange = (evt: Event): any => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(xhr.response as ArrayBuffer);
                }
            };
            xhr.open("get", url, true, null, null);
            xhr.send();
        });
    }
}

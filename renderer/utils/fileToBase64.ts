
export function convertBlobToBase64(blob: Blob):Promise<string> {
    return new Promise(async (resolve, reject) => {
        const buffer = Buffer.from(await blob.arrayBuffer());
        const base64 = buffer.toString('base64');
        resolve(base64);
    });
}
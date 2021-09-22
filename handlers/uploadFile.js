module.exports = (fileName, file) =>
new Promise(resolve => {
    console.log(`Started uploading: ${fileName}`);
    setTimeout(() => {
        console.log(`Done uploading: ${fileName}`)
        resolve();
    }, 5e3);
});
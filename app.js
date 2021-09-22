const AsyncQueue = require("./AsyncQueue");
const uploadFile = require("./handlers/uploadFile");

const fileUploadQueue = new AsyncQueue(uploadFile);

fileUploadQueue.add('1', 'file1');
fileUploadQueue.add('2', 'file2');
fileUploadQueue.add('3', 'file3');

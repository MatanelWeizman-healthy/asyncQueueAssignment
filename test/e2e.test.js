const AsyncQueue = require('../AsyncQueue');
const uploadFile = require('../handlers/uploadFile');

const fileUploadQueue = new AsyncQueue(uploadFile);


describe('check the output of all the async mission that sended to the service',()=>{
    console.log = jest.fn()

    fileUploadQueue.add('1', 'file1');
    fileUploadQueue.add('2', 'file2');
    fileUploadQueue.add('3', 'file3');

    expect(console.log).toHaveBeenCalledWith(`Done uploading: file1`);
    expect(console.log).toHaveBeenCalledWith(`Done uploading: file2`);
    expect(console.log).toHaveBeenCalledWith(`Done uploading: file3`);

})
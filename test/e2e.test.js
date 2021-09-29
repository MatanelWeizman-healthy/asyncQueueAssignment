require('dotenv').config()

const AsyncQueue = require('../AsyncQueue');
const uploadFile = require('../handlers/uploadFile');

const fileUploadQueue = new AsyncQueue(uploadFile);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
describe('e2e',()=>{

    test('check the output of all the async mission that sended to the service', async () => {
        
        const consoleSpy = jest.spyOn(console, 'log');

        await Promise.all([
            fileUploadQueue.add('1', 'file1'),
            fileUploadQueue.add('2', 'file2'),
            fileUploadQueue.add('3', 'file3') 
        ])

        await sleep(6000);
        
        expect.assertions(6)
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^.*upload.*$/));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^.*upload.*$/));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^.*upload.*$/));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^.*upload.*$/));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^.*upload.*$/));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^.*upload.*$/));

        await fileUploadQueue.terminate()
        
    }, 10000)
})
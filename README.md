# Async queue

## Introduction

We want to upload a bunch of files. Not simultaneously though. Only one at a time.
 
The new queue interface should look like this:

```javascript
const fileUploadQueue = new AsyncQueue(uploadFile);

fileUploadQueue.add('1', 'file1');
fileUploadQueue.add('2', 'file2');
fileUploadQueue.add('3', 'file3');

```

## Usage

### Run

```zsh
    docker-compose up
```
*  *Note*: When running with docker-compose there will be several reconnect attempts to the queue until the Rabbit container worked and the node service could connect to it successfully

or

```zsh
    npm start
```
* *Note*: in this way we need local instance of RabbitMQ


### Test
There are only e2e test
```zsh
    npm test
```



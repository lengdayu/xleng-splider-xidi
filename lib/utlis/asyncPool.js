module.exports = class myAsyncPoll {
  list = []; //任务池
  maxLimit = 50; //任务池最大同时执行任务队列的数量
  workingNum = 0; //任务池中启动队列的数量

  //设置最大执行数量
  setMaxLimit(num) {
    this.maxLimit = num;
  }

  //往队列池中添加任务
  add(promiseCreater) {
    this.list.push(promiseCreater);
  }

  //开始启动任务池中的任务队列
  start() {
    for (let i = 0; i < this.maxLimit; i++) {
      this.doNext();
    }
  }

  //任务队列的自动执行（空闲自动调用下一个）
  doNext() {
    if (this.list.length && this.workingNum <= this.maxLimit) {
      this.workingNum++;
      //this.list.shift()() 找到数组中第一个并调用异步任务
      //.then（）中执行下一个，并修改工作的任务数量-1
      this.list
        .shift()()
        .then(() => {
          this.workingNum--;
          this.doNext();
        });
    }
  }
};

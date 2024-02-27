import vm from 'vm'
export function safeEvalAssign(str: string) {
  // 创建一个上下文对象，用于在沙盒中执行代码
  let externalVariable
  const context = {
    console: console,  // 允许在沙盒中访问 console
    setExternalVariable: function (value) {
      externalVariable = value; // 将值赋给外部变量
    }
  };

  // 要执行的 JavaScript 代码
  const code = `setExternalVariable(${str})`
  try {
    // 在沙盒中执行代码
    vm.runInNewContext(code, context, { timeout: 2000 });
    return externalVariable
  } catch (err) {
    console.error('Error during code execution:', err);
    throw new Error("数据解析错误")
  }
}

1. **修改package.json**：添加`onUri`激活事件，使插件能响应vscode://协议URL
2. **修改extension.ts**：

   * 在activate函数中添加URI处理逻辑

   * 解析URL中的filePath和snippet参数

   * 根据参数组合决定跳转模式：

     * 只有filePath：使用file模式，直接跳转到文件

     * 同时有filePath和snippet：使用file-snippet模式，跳转到文件并搜索代码片段

     * 只有snippet：使用global-snippet模式，全局搜索并跳转到唯一匹配的代码片段
3. **设计URL格式**：`vscode://lirentech.file-ref-tags?filePath=<文件路径>&snippet=<代码片段>`
4. **处理参数编码**：确保URL参数正确编码和解码，特别是文件路径和代码片段中的特殊字符
5. **实现跳转逻辑**：

   * 复用现有的\_jumpToReference方法的核心逻辑

   * 创建新的handleUri方法来处理URL跳转
6. **测试功能**


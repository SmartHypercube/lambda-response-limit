# AWS Lambda 的 response limit 规则

Python:

```python
import json

max_result_length = 6291556
def result_length(r):
    return len(json.dumps(r, ensure_ascii=False).encode())
```

Node.js:

```js
const maxResultLength = 6291556;
function resultLength(r) {
  return Buffer.byteLength(JSON.stringify(r));
}
```

## 验证方法

使用 `serverless deploy` 部署，对于每个函数：

假设得到的 URL 为 `https://example.lambda-url.us-east-1.on.aws/`，则 `curl -X HEAD -v https://example.lambda-url.us-east-1.on.aws/?n=6291556` 预期看到 200 返回码，`curl -X HEAD -v https://example.lambda-url.us-east-1.on.aws/?n=6291557` 预期看到 502 返回码。

## 冷知识

6291556 = 6 * 1024 * 1024 + 100

不仅对于每种语言的 runtime 检查规则不一致，而且这些规则都和真正发回 HTTP response 时编码的规则不一致。在 Python 中返回 `{'s': '/' * 6291567}` 或在 Node.js 中返回 `{s: '/'.repeat(6291568)}` 都能正好用尽最大长度（注意到 Node.js 能多塞进一个 `/` 字符，因为 Node.js 检查长度时，冒号后面没有空格），但收到的 HTTP response 的长度分别是 12583102 和 12583104，远远超过 6MB。真正发回 HTTP response 时，冒号和逗号后面没有空格，但 `/` 字符会不必要地被编码成 `\/`，这产生了以上结果。

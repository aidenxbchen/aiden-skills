---
name: feishu-html-content
description: Safely handle HTML content when working with Feishu documents. Provides guidelines for sharing HTML files and code without causing blank documents.
---

# Feishu HTML Content Handling Skill

## 核心用途

将生成的 HTML 文件通过飞书云文档分享给用户。方法是创建飞书云文档，将 HTML 代码完整复制到文档中。

## 处理大文件的策略

对于较大的 HTML 文件，不能作为附件插入（这种方法无法实现），需要采用**分块粘贴**的方式：

1. 将 HTML 文件拆分成若干部分（每块 < 10KB）
2. 依次粘贴到同一个飞书云文档中
3. 最终输出完整的飞书云文档链接

## 具体操作流程

### 小文件（< 10KB）

直接完整复制到飞书云文档：

```javascript
// 1. 创建飞书文档
const doc = await feishu_doc.create({
  title: "HTML 内容",
  folder_token: "可选的文件夹token"
});

// 2. 将 HTML 内容写入文档
await feishu_doc.write({
  doc_token: doc.doc_token,
  content: htmlContent  // 完整的 HTML 代码
});

// 3. 输出文档链接
return `飞书云文档：https://open.feishu.cn/document/${doc.doc_token}`;
```

### 大文件（>= 10KB）

需要分块处理，确保每块小于 10KB（10240 字节）：

```javascript
// 1. 创建飞书文档
const doc = await feishu_doc.create({
  title: "HTML 内容（分段）",
  folder_token: "可选的文件夹token"
});

// 2. 将 HTML 拆分成多个部分（每块 < 10KB）
const chunks = splitHtmlIntoChunks(htmlContent, maxChunkSize = 10240);

// 3. 依次写入文档
for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  const isFirst = i === 0;
  const header = isFirst 
    ? `<!-- HTML 内容共 ${chunks.length} 部分 -->\n` 
    : `\n\n<!-- 第 ${i + 1}/${chunks.length} 部分 -->\n`;
  
  if (isFirst) {
    // 第一部分使用 write
    await feishu_doc.write({
      doc_token: doc.doc_token,
      content: header + chunk
    });
  } else {
    // 后续部分使用 append
    await feishu_doc.append({
      doc_token: doc.doc_token,
      content: header + chunk
    });
  }
}

// 4. 输出文档链接
return `飞书云文档：https://open.feishu.cn/document/${doc.doc_token}`;
```

## HTML 无损失拆分函数

```javascript
/**
 * 将 HTML 无损失地拆分成若干小块
 * 每块保证 < maxChunkSize 字节，且不破坏 HTML 标签结构
 */
function splitHtmlIntoChunks(html, maxChunkSize = 10240) {
  const chunks = [];
  let remaining = html;
  
  while (remaining.length > 0) {
    // 如果剩余内容小于等于 maxChunkSize，直接作为最后一块
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }
    
    // 在 maxChunkSize 附近找一个合适的分割点
    let splitPoint = maxChunkSize;
    
    // 优先在标签结束处（>）分割，避免破坏标签
    const tagEndIndex = remaining.lastIndexOf('>', splitPoint);
    if (tagEndIndex > splitPoint * 0.7) {
      // 如果在 maxChunkSize 的 70% 处找到标签结束符，就在那里分割
      splitPoint = tagEndIndex + 1;
    } else {
      // 否则在 maxChunkSize 处分割，但优先找前一次的标签结束符
      const altSplitPoint = remaining.lastIndexOf('>', maxChunkSize);
      if (altSplitPoint > maxChunkSize * 0.5) {
        splitPoint = altSplitPoint + 1;
      }
    }
    
    chunks.push(remaining.substring(0, splitPoint));
    remaining = remaining.substring(splitPoint);
  }
  
  return chunks;
}
```

## 重要注意事项

1. **不要作为附件插入**：大 HTML 文件作为附件无法达到预期效果
2. **分块大小严格限制**：每块必须 < 10KB（10240 字节）
3. **保持 HTML 完整性**：确保分割不会破坏标签结构，优先在标签结束处分割
4. **添加分段标记**：每块添加 `<!-- 第 X/Y 部分 -->` 方便用户理解
5. **输出文档链接**：完成后必须返回飞书云文档链接，格式：`https://open.feishu.cn/document/<doc_token>`

## 完整示例

```javascript
async function shareHtmlToFeishu(title, htmlContent, folderToken = null) {
  const MAX_CHUNK_SIZE = 10240; // 10KB
  
  // 1. 创建飞书文档
  const doc = await feishu_doc.create({
    title: title,
    folder_token: folderToken
  });
  
  // 2. 判断是否需要分块
  if (htmlContent.length <= MAX_CHUNK_SIZE) {
    // 小文件直接写入
    await feishu_doc.write({
      doc_token: doc.doc_token,
      content: htmlContent
    });
  } else {
    // 大文件分块处理
    const chunks = [];
    let remaining = htmlContent;
    
    while (remaining.length > 0) {
      if (remaining.length <= MAX_CHUNK_SIZE) {
        chunks.push(remaining);
        break;
      }
      
      let splitPoint = MAX_CHUNK_SIZE;
      const tagEndIndex = remaining.lastIndexOf('>', splitPoint);
      if (tagEndIndex > splitPoint * 0.7) {
        splitPoint = tagEndIndex + 1;
      } else {
        const altSplitPoint = remaining.lastIndexOf('>', MAX_CHUNK_SIZE);
        if (altSplitPoint > MAX_CHUNK_SIZE * 0.5) {
          splitPoint = altSplitPoint + 1;
        }
      }
      
      chunks.push(remaining.substring(0, splitPoint));
      remaining = remaining.substring(splitPoint);
    }
    
    // 3. 依次写入各块
    for (let i = 0; i < chunks.length; i++) {
      const isFirst = i === 0;
      const header = isFirst 
        ? `<!-- HTML 内容共 ${chunks.length} 部分 -->\n` 
        : `\n\n<!-- 第 ${i + 1}/${chunks.length} 部分 -->\n`;
      
      if (isFirst) {
        await feishu_doc.write({
          doc_token: doc.doc_token,
          content: header + chunks[i]
        });
      } else {
        await feishu_doc.append({
          doc_token: doc.doc_token,
          content: header + chunks[i]
        });
      }
    }
  }
  
  // 4. 返回飞书云文档链接
  return `飞书云文档：https://open.feishu.cn/document/${doc.doc_token}`;
}
```

## Related Skills

- **feishu-doc**: Core Feishu document operations
- **frontend-slides**: HTML presentation generation
---
name: html2feishu
description: 将 HTML 文件转换为飞书云文档，支持大文件处理，确保代码完整无损且纯净输出。
---

# HTML to Feishu 文档转换技能 (v2 - 基于PREMIR项目经验)

## 核心功能

将生成的 HTML 文件通过创建飞书云文档的方式分享给用户，确保 HTML 代码完整无损且**纯净输出**地展示在文档中。

## 关键原则

### 纯净输出（最重要）
- **飞书文档中只包含原始 HTML 代码，绝对不添加任何额外内容**
- 不添加标题、说明文字、文件信息、分段注释等任何非原始代码内容
- 用户应该能够直接复制文档中的内容并立即使用，无需任何清理

### 完整性保证
- **优先使用一次性完整写入**，避免分块导致的内容重复和格式混乱
- 只有在完整写入明确失败时才考虑分块策略
- 分割点必须在合理的代码边界处（如标签结束符 `>` 后）

### 大小限制
- 每块必须严格小于 10KB（10240 字节）**（仅在分块时适用）**

## 处理策略（重大更新）

### 🚀 推荐策略：优先完整写入（基于PREMIR项目39KB成功经验）
- **不要预设分块**：即使HTML文件看起来很大（如30-50KB），也先尝试完整写入
- **实测证明**：Feishu API的实际限制比文档说明更宽松
- **优势**：保证内容完整性，避免分块复杂性

### 🔧 回退策略：仅在必要时分块
- 只有当完整写入明确抛出大小限制错误时，才启用分块
- 分块时严格遵守纯净输出原则：**不添加任何分段注释**

## 操作流程

### 1. 创建飞书文档
```javascript
const doc = await feishu_doc.create({
  title: "HTML 内容", // 或基于原始文件名的标题
  folder_token: "可选的文件夹token"
});
```

### 2. 优先尝试完整写入
```javascript
// 首先尝试完整写入（推荐）
try {
  await feishu_doc.write({
    doc_token: doc.doc_token,
    content: htmlContent // 完整HTML代码，无任何额外内容
  });
} catch (error) {
  // 如果明确是大小限制错误，再尝试分块
  if (error.message.includes('size') || error.message.includes('limit')) {
    await handleWithChunking(doc.doc_token, htmlContent);
  } else {
    throw error;
  }
}
```

### 3. 返回文档链接
输出格式：`飞书云文档：https://open.feishu.cn/document/${doc.doc_token}`

## HTML 分块算法（仅在必要时使用）

```javascript
/**
 * 将 HTML 无损拆分为多个小于 10KB 的块（仅在完整写入失败时使用）
 * @param {string} html - 完整的 HTML 内容
 * @param {number} maxChunkSize - 最大块大小（默认 10240 字节）
 * @returns {string[]} - 分块后的数组
 */
function splitHtmlIntoChunks(html, maxChunkSize = 10240) {
  const chunks = [];
  let remaining = html;
  
  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }
    
    // 在 maxChunkSize 附近寻找最佳分割点
    let splitPoint = maxChunkSize;
    
    // 优先在标签结束处（>）分割，避免破坏标签结构
    const tagEndIndex = remaining.lastIndexOf('>', splitPoint);
    if (tagEndIndex > splitPoint * 0.7) {
      splitPoint = tagEndIndex + 1;
    } else {
      // 如果找不到合适的标签结束符，在 maxChunkSize 处分割
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

/**
 * 分块处理函数（保持纯净输出）
 */
async function handleWithChunking(docToken, htmlContent) {
  const chunks = splitHtmlIntoChunks(htmlContent);
  
  // 写入第一部分（纯净输出，无额外内容）
  await feishu_doc.write({
    doc_token: docToken,
    content: chunks[0]
  });
  
  // 追加后续部分（纯净输出，无额外内容）
  for (let i = 1; i < chunks.length; i++) {
    await feishu_doc.append({
      doc_token: docToken,
      content: chunks[i]
    });
  }
}
```

## 完整实现示例（PREMIR项目模式）

```javascript
async function htmlToFeishu(title, htmlContent, folderToken = null) {
  // 创建飞书文档
  const doc = await feishu_doc.create({
    title: title,
    folder_token: folderToken
  });
  
  try {
    // 🚀 关键改进：优先完整写入，不分块
    await feishu_doc.write({
      doc_token: doc.doc_token,
      content: htmlContent // 纯净输出：只包含原始HTML代码
    });
    
  } catch (error) {
    // 🔧 仅在必要时回退到分块策略
    if (error.message.toLowerCase().includes('size') || 
        error.message.toLowerCase().includes('limit') ||
        error.message.toLowerCase().includes('large')) {
      
      console.log("完整写入失败，回退到分块策略");
      await handleWithChunking(doc.doc_token, htmlContent);
      
    } else {
      throw error;
    }
  }
  
  return `飞书云文档：https://open.feishu.cn/document/${doc.doc_token}`;
}
```

## 重要约束

1. **纯净输出**：飞书文档中只包含原始 HTML 代码，不添加任何其他内容
2. **完整性优先**：优先完整写入，避免分块带来的风险
3. **大小限制**：分块时每块必须严格小于 10KB（10240 字节）
4. **链接返回**：必须提供完整的飞书云文档链接供用户访问
5. **用户体验**：用户应该能够直接复制文档内容并立即使用，无需任何后处理

## 常见错误避免

❌ **错误做法**：
- 预设分块（"文件看起来大就分块"）
- 添加 "第 X/Y 部分" 注释
- 在文档开头添加文件信息或说明
- 在代码中间插入任何非原始代码的内容

✅ **正确做法**：
- 优先完整写入（基于PREMIR 39KB成功经验）
- 只输出原始 HTML 代码
- 保持代码的连续性和完整性
- 确保分块边界不会破坏代码结构（仅在必要时）

## 实测参考（PREMIR项目）
- **文件大小**: 39,618 字节 (~39KB)
- **处理方式**: 一次性完整写入
- **结果**: ✅ 成功，无任何内容丢失或格式问题
- **验证**: 包含完整的DOCTYPE到</html>结构

---
*基于PREMIR演示文稿项目（39KB完整HTML）的成功经验更新*
*最后更新: 2026-03-02*
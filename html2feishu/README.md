# html2feishu - HTML to Feishu Document Converter

## Overview
Converts HTML files to Feishu cloud documents with complete code integrity and pure output. Based on real-world experience from the PREMIR presentation project (39KB HTML file successfully uploaded).

## Key Features
- **Pure Output**: Only original HTML code in the document, no extra content
- **Intelligent Processing**: Prefers complete write over chunking for better reliability
- **Fallback Strategy**: Automatically falls back to chunking only when necessary
- **Size Handling**: Successfully handles files up to 50KB+ based on testing

## Usage
The skill automatically:
1. Creates a Feishu document with appropriate title
2. Attempts complete write first (recommended approach)
3. Falls back to chunking only if size limits are hit
4. Returns the Feishu document link for user access

## Best Practices
- Always verify HTML completeness after upload
- Prefer complete write over pre-emptive chunking
- Maintain pure output without any annotations or comments
- Test with actual file sizes rather than theoretical limits

## Real-World Validation
Successfully tested with:
- **PREMIR Presentation**: 39,618 bytes (39KB) complete HTML5 file
- **Result**: Full functionality preserved, no content loss or corruption

## Related Skills
- `feishu-doc`: Core Feishu document operations
- `frontend-slides`: HTML presentation generation

---
*Part of the OpenClaw Skills Collection*
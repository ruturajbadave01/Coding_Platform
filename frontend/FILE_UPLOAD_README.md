# 📁 File Upload System for MCQ Questions

## 🆕 New Features

The Create Contest system now supports multiple file formats for bulk importing MCQ questions:

- **📄 Text Files (.txt)** - Plain text format
- **📘 Word Documents (.docx)** - Modern Word format
- **📕 PDF Files (.pdf)** - PDF documents with selectable text
- **📗 Word Documents (.doc)** - Legacy Word format (limited support)

## 🚀 Setup Instructions

### 1. Install Dependencies

Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
```

This will install:
- `pdfjs-dist` - For PDF parsing
- `mammoth` - For Word document parsing

### 2. File Format Requirements

#### Text Files (.txt)
- Standard text format
- No special requirements
- Fastest parsing

#### Word Documents (.docx)
- Modern Word format (recommended)
- Must contain text (not just images)
- Good compatibility

#### PDF Files (.pdf)
- **Must contain selectable text**
- Scanned images are NOT supported
- Text must be copyable from the PDF
- Slower parsing than text files

#### Word Documents (.doc)
- Legacy format
- Limited support
- **Recommendation: Convert to .docx**

## 📋 Expected MCQ Format

All file types must follow this format for successful parsing:

```
1. What is the capital of France?
A. London
B. Paris
C. Berlin
D. Madrid
Answer: B

2. Which programming language is this?
A. Python
B. Java
C. JavaScript
D. C++
Answer: A
```

### Format Rules:
1. **Question Number**: Start with number + dot/parenthesis (1., 2., etc.)
2. **Options**: Labeled A, B, C, D (or a, b, c, d)
3. **Answer**: Specify with "Answer:" or "Correct:"
4. **Spacing**: Empty lines between questions are ignored
5. **Description**: Additional text after question title is captured

## 🔧 How It Works

### 1. File Upload
- User selects file from supported formats
- System validates file type
- Shows file type badge and name

### 2. Text Extraction
- **Text Files**: Direct reading
- **Word (.docx)**: Uses mammoth.js library
- **PDF**: Uses PDF.js library
- **Word (.doc)**: Limited support, recommends conversion

### 3. MCQ Parsing
- Intelligent pattern recognition
- Automatically detects questions, options, answers
- Validates format and structure
- Shows preview of parsed questions

### 4. Import
- One-click import of all questions
- Automatic contest title suggestion
- Seamless integration with contest creation

## ⚠️ Common Issues & Solutions

### PDF Parsing Fails
**Problem**: "PDF parsing failed" error
**Solution**: Ensure PDF contains selectable text, not scanned images

### Word Document Issues
**Problem**: "Word document parsing failed" error
**Solution**: 
- Convert .doc to .docx format
- Ensure document contains actual text
- Check file isn't corrupted

### No Questions Found
**Problem**: "No MCQ questions found" error
**Solution**: 
- Check format matches expected structure
- Ensure questions start with numbers
- Verify options are labeled A, B, C, D
- Check answer format uses "Answer:" or "Correct:"

## 🎯 Best Practices

### For Teachers/Admins:
1. **Use .docx format** for Word documents
2. **Ensure PDFs have selectable text**
3. **Follow the exact format** shown in the template
4. **Test with small files first**
5. **Keep questions simple** for better parsing

### File Preparation:
1. **Clean formatting** - Remove unnecessary styling
2. **Consistent structure** - Use same format for all questions
3. **Clear labeling** - Make sure A, B, C, D are obvious
4. **Simple text** - Avoid complex symbols or formatting

## 📊 Performance Notes

- **Text files**: Fastest parsing
- **Word documents**: Medium speed
- **PDF files**: Slowest parsing (depends on complexity)
- **Large files**: May take longer to process

## 🔮 Future Enhancements

- **Excel support** (.xlsx, .csv)
- **Google Docs integration**
- **Image-based question parsing** (OCR)
- **Advanced format detection**
- **Batch file processing**

## 🆘 Support

If you encounter issues:

1. **Check file format** matches requirements
2. **Verify file isn't corrupted**
3. **Try converting to different format**
4. **Use the template** as reference
5. **Check browser console** for error details

## 📝 Example Files

Download the template file from the Create Contest page:
- **mcq-template.txt** - Ready-to-use example
- **Format examples** - Visual guides in the interface

---

**Happy Contest Creating! 🏆** 
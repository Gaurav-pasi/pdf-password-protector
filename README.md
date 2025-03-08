# PDF Password Protector

A simple Node.js package that uses Java to add strong password protection to PDF files.

## Prerequisites

- Node.js
- Java (JDK 8 or higher)

## Installation

```bash
npm install pdf-password-protector
```

## Quick Start

```javascript
const PdfPasswordProtector = require('pdf-password-protector');

// Protect a PDF with a password
await PdfPasswordProtector.protect('input.pdf', 'protected.pdf', 'mypassword123');

// Check if a PDF is protected
const isProtected = await PdfPasswordProtector.isProtected('document.pdf');
console.log(`Is protected: ${isProtected}`);

// Use different user and owner passwords
await PdfPasswordProtector.protect('input.pdf', 'protected.pdf', 'userpass123', {
  ownerPassword: 'ownerpass456'
});
```

## API

### protect(input, outputPath, password, options?)

Adds password protection to a PDF file.

- `input`: Path to the PDF file or Buffer containing PDF data
- `outputPath`: Path where the protected PDF will be saved
- `password`: Password to protect the PDF
- `options`: (Optional)
  - `ownerPassword`: Set a different owner password

### isProtected(input)

Checks if a PDF is password protected.

- `input`: Path to the PDF file or Buffer containing PDF data
- Returns: Promise<boolean>

## How It Works

This package uses Apache PDFBox (a Java library) to provide robust PDF encryption. The Node.js component acts as a bridge to the Java implementation.

## Features

- Add password protection to PDF files
- Support for different user and owner passwords
- Check if a PDF is password protected
- Works with both file paths and PDF buffers
- Uses Apache PDFBox for robust PDF encryption

## Default Protection Settings

When protecting a PDF, the following permissions are set:
- Low-resolution printing allowed
- Modification disabled
- Content copying disabled
- Annotations disabled
- Form filling allowed
- Content accessibility enabled
- Document assembly disabled

## License

MIT 
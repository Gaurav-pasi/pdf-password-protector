# PDF Password Protector

A simple Node.js package that uses Java to add strong password protection to PDF files.

## Prerequisites

Before installing this package, make sure you have the following installed on your system:

- Node.js (version 12.0.0 or higher)
- Java Runtime Environment (JRE 8 or higher)

You can verify the installations by running:
```bash
node --version
java -version
```

## Installation

```bash
npm install pdf-password-protector
```

## Quick Start

```javascript
const PdfPasswordProtector = require('pdf-password-protector');

async function main() {
  // Protect a PDF with a user password
  await PdfPasswordProtector.protect('sample.pdf', 'protected.pdf', 'mypassword123');

  // Check if user PDF is protected
  const isProtectedUser = await PdfPasswordProtector.isProtected('protected.pdf');
  console.log(`User pdf is protected: ${isProtectedUser}`);

  // Use different user and owner passwords
  await PdfPasswordProtector.protect('sample.pdf', 'ownerProtected.pdf', 'userpass123', {
    ownerPassword: 'ownerpass456'
  });
  // Check if owner PDF is protected
  const isProtectedOwner = await PdfPasswordProtector.isProtected('ownerProtected.pdf');
  console.log(`Owner pdf is protected: ${isProtectedOwner}`);
}

main().catch(console.error);
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
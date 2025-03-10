const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class PdfPasswordProtector {
  /**
   * Get the path to the JAR file
   * @private
   * @returns {string} Path to the JAR file
   */
  static _getJarPath() {
    return path.join(__dirname, 'lib', 'pdf-password-protector.jar');
  }

  /**
   * Execute the Java command
   * @private
   * @param {string[]} args Command line arguments
   * @returns {Promise<string>} Command output
   */
  static _executeJavaCommand(args) {
    return new Promise((resolve, reject) => {
      const java = spawn('java', ['-jar', this._getJarPath(), ...args]);
      
      let output = '';
      let error = '';

      java.stdout.on('data', (data) => {
        output += data.toString();
      });

      java.stderr.on('data', (data) => {
        error += data.toString();
      });

      java.on('close', (code) => {
        if (code === 0 && output.includes('SUCCESS')) {
          resolve(output);
        } else {
          reject(new Error(error || 'Failed to execute Java command'));
        }
      });
    });
  }

  /**
   * Protects a PDF file with a password
   * @param {string|Buffer} input - Path to the PDF file or Buffer containing PDF data
   * @param {string} outputPath - Path where the protected PDF will be saved
   * @param {string} password - Password to protect the PDF
   * @param {Object} options - Additional options
   * @param {string} options.ownerPassword - Set a different owner password (defaults to same as user password)
   * @returns {Promise<void>}
   */
  static async protect(input, outputPath, password, options = {}) {
    try {
      // If input is a Buffer, write it to a temporary file
      let inputPath = input;
      let tempFile = null;

      if (Buffer.isBuffer(input)) {
        tempFile = path.join(__dirname, `temp_${Date.now()}.pdf`);
        await fs.writeFile(tempFile, input);
        inputPath = tempFile;
      } else if (typeof input !== 'string') {
        throw new Error('Input must be a file path (string) or Buffer');
      }

      // Prepare arguments for Java command
      const args = [
        inputPath,
        outputPath,
        password
      ];

      // Add owner password if specified
      if (options.ownerPassword) {
        args.push(options.ownerPassword);
      }

      // Execute Java command
      await this._executeJavaCommand(args);

      // Clean up temporary file if created
      if (tempFile) {
        await fs.unlink(tempFile);
      }
    } catch (error) {
      throw new Error(`Failed to protect PDF: ${error.message}`);
    }
  }

  /**
   * Checks if a PDF is password protected
   * @param {string|Buffer} input - Path to the PDF file or Buffer containing PDF data
   * @returns {Promise<boolean>}
   */
  static async isProtected(input) {
    try {
      // If input is a Buffer, write it to a temporary file
      let inputPath = input;
      let tempFile = null;

      if (Buffer.isBuffer(input)) {
        tempFile = path.join(__dirname, `temp_${Date.now()}.pdf`);
        await fs.writeFile(tempFile, input);
        inputPath = tempFile;
      } else if (typeof input !== 'string') {
        throw new Error('Input must be a file path (string) or Buffer');
      }

      try {
        // Try to load the PDF with PDFBox
        const output = await this._executeJavaCommand(['--check', inputPath]);
        return output.includes('PROTECTED');
      } finally {
        // Clean up temporary file if created
        if (tempFile) {
          await fs.unlink(tempFile);
        }
      }
    } catch (error) {
      throw new Error(`Failed to check PDF protection: ${error.message}`);
    }
  }
}

module.exports = PdfPasswordProtector; 
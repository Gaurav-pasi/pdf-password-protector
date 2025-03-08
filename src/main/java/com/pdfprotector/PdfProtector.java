package com.pdfprotector;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;

public class PdfProtector {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.err.println("Usage:");
            System.err.println("  To protect: java -jar pdf-protector.jar <input-pdf> <output-pdf> <user-password> [owner-password]");
            System.err.println("  To check: java -jar pdf-protector.jar --check <input-pdf>");
            System.exit(1);
        }

        try {
            if (args[0].equals("--check")) {
                if (args.length < 2) {
                    System.err.println("Error: Input PDF path required for check operation");
                    System.exit(1);
                }
                boolean isProtected = isProtected(args[1]);
                System.out.println(isProtected ? "PROTECTED" : "NOT_PROTECTED");
                System.out.println("SUCCESS");
            } else {
                if (args.length < 3) {
                    System.err.println("Error: Insufficient arguments for protect operation");
                    System.exit(1);
                }
                String inputPath = args[0];
                String outputPath = args[1];
                String userPassword = args[2];
                String ownerPassword = args.length > 3 ? args[3] : userPassword;

                protect(inputPath, outputPath, userPassword, ownerPassword);
                System.out.println("SUCCESS");
            }
        } catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            System.exit(1);
        }
    }

    public static void protect(String inputPath, String outputPath, String userPassword, String ownerPassword) throws Exception {
        try (PDDocument document = PDDocument.load(new java.io.File(inputPath))) {
            // Set up access permissions
            AccessPermission ap = new AccessPermission();
            ap.setCanPrint(true);
            ap.setCanPrintDegraded(true);
            ap.setCanModify(false);
            ap.setCanExtractContent(false);
            ap.setCanModifyAnnotations(false);
            ap.setCanFillInForm(true);
            ap.setCanExtractForAccessibility(true);
            ap.setCanAssembleDocument(false);

            // Create protection policy
            StandardProtectionPolicy spp = new StandardProtectionPolicy(ownerPassword, userPassword, ap);
            spp.setEncryptionKeyLength(128);

            // Apply protection
            document.protect(spp);

            // Save the protected document
            document.save(outputPath);
        }
    }

    public static boolean isProtected(String inputPath) {
        try (PDDocument document = PDDocument.load(new java.io.File(inputPath))) {
            return document.isEncrypted();
        } catch (Exception e) {
            return false;
        }
    }
} 
import crypto from "crypto";

/**
 * KSeF Crypto Service for v2 (v2.3.0)
 * Handles RSA-OAEP encryption for authorization tokens.
 */
export class KSeFCrypto {
  /**
   * Encrypts the KSeF Authorization Token for the /auth/login request.
   * Format: Token | Timestamp
   * Note: In some V2 builds, the format is Token|Timestamp or a more complex XML structure.
   * According to latest MF docs for Token Method:
   * Data = Token + "|" + (Timestamp + Challenge)
   */
  static encryptToken(
    token: string,
    challenge: string,
    timestamp: string,
    publicKeyPem: string
  ): string {
    const dataToEncrypt = `${token}|${timestamp}`;
    
    // Convert PEM to public key object if needed, but Node's publicEncrypt handles PEM strings
    const buffer = Buffer.from(dataToEncrypt, "utf-8");
    
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buffer
    );

    return encrypted.toString("base64");
  }

  /**
   * Wraps a raw PEM string with proper headers if missing.
   */
  static ensurePemFormat(rawKey: string): string {
    if (rawKey.includes("BEGIN PUBLIC KEY")) return rawKey;
    return `-----BEGIN PUBLIC KEY-----\n${rawKey}\n-----END PUBLIC KEY-----`;
  }
}

import { KsefChallengeResponse, KsefSessionInitResponse, KsefSendInvoiceResponse, KsefInvoiceStatusResponse, KSEF_ENDPOINTS, KsefEnvironment, KsefPublicKeyCertificate } from "./ksef-types";
import { KSeFCrypto } from "./ksef-crypto";

export class KSeFApiClient {
  private baseUrl: string;
  private nip: string;
  private token: string;

  constructor(env: KsefEnvironment, nip: string, token: string) {
    this.baseUrl = KSEF_ENDPOINTS[env];
    this.nip = nip;
    this.token = token;
  }

  async getPublicKeyCertificates(): Promise<KsefPublicKeyCertificate[]> {
    const response = await fetch(`${this.baseUrl}/security/public-key-certificates`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`KSeF Public Key Error: ${error}`);
    }

    return response.json();
  }

  async getAuthorisationChallenge(): Promise<KsefChallengeResponse> {
    const response = await fetch(`${this.baseUrl}/auth/challenge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contextIdentifier: {
          type: "nip",
          identifier: this.nip,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`KSeF Challenge Error: ${error}`);
    }

    return response.json();
  }

  async loginAndGetToken(): Promise<string> {
    // 1. Get Challenge & Timestamp
    const challengeRes = await this.getAuthorisationChallenge();
    const { challenge, timestamp } = challengeRes;

    // 2. Get Public Key from MF (first cert with TokenEncryption support)
    const certs = await this.getPublicKeyCertificates();
    const cert = certs.find(c => c.usage.includes("KsefTokenEncryption")) || certs[0];
    
    if (!cert) throw new Error("Could not find MF public key for encryption.");

    const publicKey = KSeFCrypto.ensurePemFormat(cert.certificate);
    
    // 3. Encrypt Token + Timestamp
    const encryptedToken = KSeFCrypto.encryptToken(this.token, challenge, timestamp, publicKey);

    // 4. Session Init JSON (v2 simplified for Token method)
    // Note: v2 uses a specific InitSessionTokenRequest structure
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challenge,
        contextIdentifier: {
           type: "nip",
           identifier: this.nip
        },
        token: encryptedToken
      }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`KSeF Login Error: ${error}`);
    }

    const data = await response.json();
    return data.sessionToken.token;
  }

  async sendInvoiceInSession(xml: string, sessionToken: string): Promise<KsefSendInvoiceResponse> {
    // V2 session upload: /online/sessions/{sessionToken}/invoices
    // We send payload as JSON with Base64 encoded XML
    const response = await fetch(`${this.baseUrl}/online/sessions/${sessionToken}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "SessionToken": sessionToken,
      },
      body: JSON.stringify({
        invoiceHash: {
          hashSHA: {
            algorithm: "SHA-256",
            encoding: "Base64",
            value: Buffer.from(xml).toString("base64"), // Simplified hash
          },
          fileSize: xml.length,
        },
        invoicePayload: {
          type: "plain",
          invoiceBody: Buffer.from(xml).toString("base64"),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`KSeF Invoice Upload Error: ${error}`);
    }

    return response.json();
  }

  async closeSession(sessionToken: string): Promise<void> {
    await fetch(`${this.baseUrl}/online/sessions/${sessionToken}/close`, {
      method: "POST",
      headers: { "SessionToken": sessionToken },
    });
  }

  async getInvoiceStatus(invoiceId: string, sessionToken: string): Promise<KsefInvoiceStatusResponse> {
    const response = await fetch(`${this.baseUrl}/online/invoices/status/${invoiceId}`, {
      method: "GET",
      headers: { "SessionToken": sessionToken },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`KSeF Status Error: ${error}`);
    }

    return response.json();
  }
}

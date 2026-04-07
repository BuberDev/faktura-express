export type KsefEnvironment = "DEMO" | "TEST" | "PROD";

// V2 API Endpoints
export const KSEF_ENDPOINTS: Record<KsefEnvironment, string> = {
  DEMO: "https://api-demo.ksef.mf.gov.pl/v2",
  TEST: "https://api-test.ksef.mf.gov.pl/v2",
  PROD: "https://api.ksef.mf.gov.pl/v2",
};

export interface KsefChallengeResponse {
  timestamp: string;
  challenge: string;
}

export interface KsefLoginResponse {
  timestamp: string;
  referenceNumber: string;
  authenticationToken: {
    token: string;
    expiresAt: string;
  };
}

export interface KsefSessionInitResponse {
  timestamp: string;
  referenceNumber: string;
  sessionToken: {
    token: string;
    context: any;
  };
}

export interface KsefSendInvoiceResponse {
  timestamp: string;
  referenceNumber: string;
  elementReferenceNumber: string;
}

export interface KsefInvoiceStatusResponse {
  timestamp: string;
  referenceNumber: string;
  processingCode: number;
  processingDescription: string;
  upoUrl?: string;
  ksefNumber?: string;
}

export interface KsefExceptionResponse {
  exception: {
    serviceCode: string;
    serviceCtx: string;
    serviceMessage: string;
    exceptionDetailList: Array<{
      exceptionCode: number;
      exceptionDescription: string;
    }>;
  };
}

export interface KsefPublicKeyCertificate {
  certificate: string;
  validFrom: string;
  validTo: string;
  usage: string[];
}

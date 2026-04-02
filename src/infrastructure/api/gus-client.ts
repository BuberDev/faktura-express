import type {
  CompanyDetails,
  CompanyRegistryGateway,
} from "@/core/domain/interfaces/company-registry";

interface GusApiResponse {
  name: string;
  nip: string;
  address: string;
}

export class BirRegonApiClient implements CompanyRegistryGateway {
  private readonly apiBaseUrl: string;
  private readonly apiToken: string;

  constructor() {
    this.apiBaseUrl = process.env.GUS_API_BASE_URL ?? "";
    this.apiToken = process.env.GUS_API_TOKEN ?? "";
  }

  async findByNip(nip: string): Promise<CompanyDetails | null> {
    if (!this.apiBaseUrl) {
      return null;
    }

    const response = await fetch(
      `${this.apiBaseUrl.replace(/\/$/, "")}/search-by-nip?nip=${nip}`,
      {
        headers: {
          ...(this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {}),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as GusApiResponse;

    if (!payload?.name || !payload?.nip || !payload?.address) {
      return null;
    }

    return {
      name: payload.name,
      nip: payload.nip,
      address: payload.address,
    };
  }
}

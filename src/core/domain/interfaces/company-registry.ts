export interface CompanyDetails {
  name: string;
  nip: string;
  address: string;
}

export interface CompanyRegistryGateway {
  findByNip(nip: string): Promise<CompanyDetails | null>;
}

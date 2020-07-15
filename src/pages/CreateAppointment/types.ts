export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

export interface IDayAvailability {
  hour: number;
  available: boolean;
  hourFormatted: string;
}

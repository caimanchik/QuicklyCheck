export interface Cookie {
  name: string;
  value: string;
  maxAge: {
    days: number,
    minutes: number
  }
}

export interface ICookie {
  name: string;
  value: string;
  maxAge: {
    days: number,
    minutes: number
  }
}

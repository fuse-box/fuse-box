export type ICacheStrategy = 'fs' | 'memory';
export interface ICacheProps {
  enabled?: boolean;
  root?: string;
  strategy?: ICacheStrategy;
}

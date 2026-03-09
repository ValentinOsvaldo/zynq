export interface Router {
  getParams(): Record<string, string  | null>;

  push(params: Record<string, string | null>): void;
  replace(params: Record<string, string | null>): void;
}

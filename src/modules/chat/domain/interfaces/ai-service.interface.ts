export interface IAIService {
  ask(prompt: string): Promise<string>;
}

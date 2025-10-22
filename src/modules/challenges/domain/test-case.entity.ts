export class TestCase {
  constructor(
    public readonly id: string,
    public readonly challengeId: string,
    public index: number,
    public input: string,
    public output: string,
  ) {}
}
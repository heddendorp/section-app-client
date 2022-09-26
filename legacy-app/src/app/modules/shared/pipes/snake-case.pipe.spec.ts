import { SnakeCasePipe } from './snake-case.pipe';

describe('SnakeCasePipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeCasePipe();
    expect(pipe).toBeTruthy();
  });
});

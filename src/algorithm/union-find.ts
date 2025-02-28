// Simplified version of union find
export class UnionFind {
  private father: number[];

  constructor(n: number) {
    this.father = Array(n);

    for (let i = 0; i < n; i++) {
      this.father[i] = i;
    }
  }

  public find(i: number) {
    if (i !== this.father[i]) {
      this.father[i] = this.find(this.father[i]);
    }

    return this.father[i];
  }

  public isSameSet(a: number, b: number) {
    return this.find(a) === this.find(b);
  }

  public union(a: number, b: number) {
    const fa = this.find(a);
    const fb = this.find(b);
    if (fa !== fb) {
      this.father[fa] = fb;
    }
  }
}

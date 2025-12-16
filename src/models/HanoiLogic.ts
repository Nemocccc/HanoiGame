export class HanoiLogic {
  private towers: number[][];
  private numDisks: number;

  constructor(numDisks: number = 3) {
    this.numDisks = numDisks;
    this.towers = this.initializeTowers(numDisks);
  }

  private initializeTowers(n: number): number[][] {
    return [
      Array.from({ length: n }, (_, i) => n - i),
      [],
      []
    ];
  }

  public getTowers(): number[][] {
    // 返回深拷贝以确保 React 状态不可变性
    return this.towers.map(t => [...t]);
  }

  public canMove(fromIndex: number, toIndex: number): boolean {
    if (fromIndex === toIndex) return false;
    if (this.towers[fromIndex].length === 0) return false;
    if (this.towers[toIndex].length === 0) return true;

    const diskToMove = this.towers[fromIndex][this.towers[fromIndex].length - 1];
    const topTargetDisk = this.towers[toIndex][this.towers[toIndex].length - 1];
    
    return diskToMove < topTargetDisk;
  }

  public move(fromIndex: number, toIndex: number): boolean {
    if (!this.canMove(fromIndex, toIndex)) return false;
    
    const disk = this.towers[fromIndex].pop()!;
    this.towers[toIndex].push(disk);
    return true;
  }

  public isWon(): boolean {
    return this.towers[2].length === this.numDisks;
  }

  public reset(): void {
    this.towers = this.initializeTowers(this.numDisks);
  }
}

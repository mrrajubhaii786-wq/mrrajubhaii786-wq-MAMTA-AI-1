export type User = {
  id: number;
  interest: 'AI' | 'Tools' | 'Finance';
  money: number;
  status: 'IDLE' | 'BUYING' | 'BROWSING' | 'SATISFIED';
  lastAction: string;
};

export class PopulationAI {
  public users: User[] = [];

  constructor() {
    this.generateUsers(50);
  }

  generateUsers(count: number) {
    this.users = [];
    const interests: ('AI' | 'Tools' | 'Finance')[] = ["AI", "Tools", "Finance"];
    for (let i = 0; i < count; i++) {
      this.users.push({
        id: i + 1,
        interest: interests[i % interests.length],
        money: Math.floor(Math.random() * 800) + 200, // $200 to $1000 range
        status: 'IDLE',
        lastAction: 'Spawning in world grid...'
      });
    }
  }

  getUsers(): User[] {
    return this.users;
  }
}

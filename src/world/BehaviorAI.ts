import { User } from "./PopulationAI";

export class BehaviorAI {
  act(user: User, trend: 'BULL' | 'BEAR', demandIndex: number): { action: 'BUY' | 'BROWSE' | 'SAVE' | 'SELL'; log: string } {
    // If user has a lot of money, they are highly active
    if (user.money > 600) {
      if (trend === 'BULL') {
        const cost = Math.floor(Math.random() * 80) + 40;
        user.money -= cost;
        user.status = 'BUYING';
        user.lastAction = `Bought premium AI tool subscription for $${cost}`;
        return { action: "BUY", log: `👤 User ${user.id} bought premium license ($${cost}).` };
      } else {
        // High price or BEAR market makes them save
        user.status = 'BROWSING';
        user.lastAction = 'Browsing corporate toolkits during market dip';
        return { action: "BROWSE", log: `👤 User ${user.id} browsed catalog (Market BEAR discount requested).` };
      }
    } else if (user.money < 150) {
      // Out of money, they must earn or sell services
      const income = Math.floor(Math.random() * 100) + 50;
      user.money += income;
      user.status = 'SATISFIED';
      user.lastAction = `Freelanced custom automation models to gain $${income}`;
      return { action: "SELL", log: `👤 User ${user.id} worked freelance and received $${income}.` };
    } else {
      // Median money
      if (Math.random() > 0.4) {
        user.status = 'BROWSING';
        user.lastAction = 'Researching global startup trends';
        return { action: "BROWSE", log: `👤 User ${user.id} actively research trends.` };
      } else {
        const expense = Math.floor(Math.random() * 30) + 10;
        user.money -= expense;
        user.status = 'BUYING';
        user.lastAction = `Subscribed to micro-SaaS for $${expense}`;
        return { action: "BUY", log: `👤 User ${user.id} purchased low-tier subscription ($${expense}).` };
      }
    }
  }
}

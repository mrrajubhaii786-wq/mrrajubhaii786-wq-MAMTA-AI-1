import { RevenueAI } from "./RevenueAI";
import { FinanceAI } from "./FinanceAI";

const revenue = new RevenueAI();
const finance = new FinanceAI();

export class BusinessLoop {
  run(goal: string) {
    const income = revenue.generate(goal);
    const decision = finance.decide(income.revenue);

    return {
      income,
      decision
    };
  }
}

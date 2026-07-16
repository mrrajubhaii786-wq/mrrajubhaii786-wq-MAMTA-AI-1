import { BusinessLoop } from "./BusinessLoop";
import { PaymentCore } from "./PaymentCore";
import { LedgerAI } from "./LedgerAI";
import { AssetAI } from "./AssetAI";
import { AutoScale } from "./AutoScale";
import { ModelRouter } from "./ModelRouter";

const business = new BusinessLoop();
const payment = new PaymentCore();
const ledger = new LedgerAI();
const assetAI = new AssetAI();
const autoScale = new AutoScale();
const modelRouter = new ModelRouter();

export class EconomicCore {
  private balance: number = 1500;

  run(goal: string) {
    // 1. Model cost routing optimization based on task goals
    const complexity = goal === "scale" ? 8 : (goal === "earn_money" ? 5 : 2);
    const selectedModel = modelRouter.route(complexity);

    // 2. Business calculation loop
    const biz = business.run(goal);

    // 3. Process payment through verified payment core gateway
    const pay = payment.process(biz.income.revenue, "USD");

    // 4. Update the local vault balance safely
    if (pay.status === "SUCCESS") {
      this.balance += pay.amount;
    }

    // 5. Asset generation or expansion check
    if (biz.decision === "EXPAND" && Math.random() > 0.4) {
      assetAI.add("New Compute Node Shard");
      this.balance -= 200; // cost to acquire resource node
    }

    // 6. Cloud scaling load analysis
    const randomCpuLoad = Math.floor(Math.random() * 40) + 45; // 45-85%
    const scaleAction = autoScale.scale(randomCpuLoad);

    // 7. Write entry into ledger secure validation log
    const ledgerResult = ledger.record({
      action: "ECONOMIC_RECONCILIATION",
      goal,
      modelUsed: selectedModel,
      payStatus: pay.status,
      revenueEarned: biz.income.revenue,
      scalingAction: scaleAction,
      newBalance: this.balance
    });

    return {
      biz,
      pay,
      record: ledgerResult,
      balance: this.balance,
      scaleAction,
      modelUsed: selectedModel,
      assets: assetAI.getAssets(),
      ledgerHistory: ledger.getLedger()
    };
  }

  getBalance() {
    return this.balance;
  }

  getAssets() {
    return assetAI.getAssets();
  }

  getLedgerHistory() {
    return ledger.getLedger();
  }
}

export const economicCoreInstance = new EconomicCore();

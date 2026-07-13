export interface EmpireCompany {
  id: string;
  name: string;
  revenue: number;
  users: number;
  cash: number;
  niche: string;
  products: string[];
  status: 'ACTIVE' | 'SCALING' | 'OPTIMIZING';
}

export class CompanyManager {
  private companies: EmpireCompany[] = [
    {
      id: "co_1",
      name: "Mamta Core Analytics",
      revenue: 145,
      users: 620,
      cash: 2400,
      niche: "Analytics Tools",
      products: ["Mamta AI Analytics v1.2", "Cohort Retention API"],
      status: "ACTIVE"
    },
    {
      id: "co_2",
      name: "FinSight OS",
      revenue: 95,
      users: 310,
      cash: 1250,
      niche: "Financial Systems",
      products: ["FinSight Ledger v1.0"],
      status: "ACTIVE"
    },
    {
      id: "co_3",
      name: "DevOps Copilot AI",
      revenue: 180,
      users: 1150,
      cash: 3800,
      niche: "Infrastructure",
      products: ["K8s AutoPod Resizer", "Daemon Log Synthesizer"],
      status: "SCALING"
    }
  ];

  createCompany(name: string, niche: string = "AI Automation") {
    const company: EmpireCompany = {
      id: "co_" + Math.random().toString(36).substring(2, 9),
      name,
      revenue: Math.floor(Math.random() * 50) + 20,
      users: Math.floor(Math.random() * 100) + 40,
      cash: Math.floor(Math.random() * 400) + 300,
      niche,
      products: ["Module Alpha v1.0"],
      status: "ACTIVE"
    };

    this.companies.push(company);
    return company;
  }

  getAll() {
    return this.companies;
  }

  tickCompanies() {
    this.companies.forEach(c => {
      // Simulate organic expansion of revenues and users
      const userGrowth = Math.floor(Math.random() * 12) + 1;
      const revenueGrowth = Math.floor(Math.random() * 5) + 1;
      c.users += userGrowth;
      c.revenue += revenueGrowth;
      c.cash += revenueGrowth * 4;
    });
  }
}

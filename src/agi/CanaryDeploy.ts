export interface CanaryStatus {
  version: string;
  status: "STANDBY" | "ROLLING" | "STABLE" | "TESTING";
  trafficAllocation: string;
  timestamp: number;
}

export class CanaryDeploy {
  private activeDeploys: CanaryStatus[] = [];

  deploy(version: string): CanaryStatus {
    const freshDeploy: CanaryStatus = {
      version,
      status: "TESTING",
      trafficAllocation: "1%",
      timestamp: Date.now()
    };

    this.activeDeploys.push(freshDeploy);
    if (this.activeDeploys.length > 10) {
      this.activeDeploys.shift();
    }

    return freshDeploy;
  }

  getDeploys() {
    return this.activeDeploys;
  }
}

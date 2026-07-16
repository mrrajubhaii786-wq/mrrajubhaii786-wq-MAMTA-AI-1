export class AssetAI {
  assets: any[] = [
    { id: "node-aws-01", type: "Server Node Cluster", value: 1200, location: "us-east-1" },
    { id: "ip-subnet-alpha", type: "Dedicated IPv4 Block", value: 450, location: "global" },
    { id: "storage-glacier-safe", type: "Replicated Cold Storage Shard", value: 350, location: "eu-central-1" }
  ];

  add(asset: string) {
    const newAsset = {
      id: "asset-" + Math.random().toString(36).substr(2, 5),
      type: asset,
      value: Math.floor(Math.random() * 800) + 200,
      location: ["us-west-2", "eu-west-1", "ap-southeast-1"][Math.floor(Math.random() * 3)]
    };
    this.assets.push(newAsset);
    return this.assets;
  }

  getAssets() {
    return this.assets;
  }
}

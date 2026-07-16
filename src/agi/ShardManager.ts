export class ShardManager {
  shards: Record<number, any> = {};

  assign(key: string, value: any) {
    // Shard algorithm based on first character ASCII modulo 3
    const shard = key.charCodeAt(0) % 3;
    this.shards[shard] = {
      ...(this.shards[shard] || {}),
      [key]: value
    };
  }

  getShard(id: number) {
    return this.shards[id] || {};
  }

  getAllShards() {
    return this.shards;
  }
}

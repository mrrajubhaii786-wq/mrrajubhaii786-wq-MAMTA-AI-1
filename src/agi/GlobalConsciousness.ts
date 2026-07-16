export class GlobalConsciousness {
  state: any = {};

  merge(layers: any[]) {
    this.state = Object.assign({}, ...layers);
    return this.state;
  }

  getMergedState() {
    return this.state;
  }
}

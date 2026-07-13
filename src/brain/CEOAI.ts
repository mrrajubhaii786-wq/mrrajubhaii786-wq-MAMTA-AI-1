export class CEOAI {
  decideNextMove(data: { revenue: number; users: number }) {
    if (data.revenue < 100) {
      return "FOCUS_MARKETING";
    }

    if (data.users > 1000) {
      return "SCALE_INFRA";
    }

    return "BUILD_NEW_PRODUCT";
  }
}

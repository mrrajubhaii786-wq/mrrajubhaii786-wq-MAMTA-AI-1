export class SelfTrainer {
  improve(response: string): string {
    // Basic improvement logic: if response is short, expand politely or add conversational depth
    if (response.length < 50 && !response.includes("explain") && !response.includes("detail")) {
      return response + "\n\nMain is baare me aur detail me bhi explain kar sakti hoon agar aap chahein! 🙂";
    }

    return response;
  }
}

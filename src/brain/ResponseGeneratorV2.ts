import { ConversationContext } from "./ContextEngine";

export class ResponseGeneratorV2 {
  generate(input: string, context: ConversationContext, emotion: "sad" | "happy" | "angry" | "confused" | "neutral"): string {
    const text = input.toLowerCase().trim();
    let response = "";
    let followUp = "";

    // 1. TOPIC: SCIENCE
    if (context.topic === "science") {
      response = `Yeh bahut interesting sawal hai 👀

Universe ki shuruaat Big Bang se hui thi (13.8 billion years pehle).

Life develop hui:
• Stars → Elements (Carbon, Oxygen, Nitrogen)
• Earth → Chemistry
• Cells → Evolution

Yeh ek natural process hai jo time ke saath develop hua ✨`;

      followUp = "👉 Tumhe kya lagta hai — kya universe me aur kahin life ho sakti hai?";
    }

    // 2. TOPIC: TECH / BUILD / CODE
    else if (context.topic === "tech") {
      response = `Engineering aur development to mera favourite playground hai! 💻✨

Coding aur system design ke concepts bahut logical hote hain. Jab hum solid architecture create karte hain, toh automatic pipelines smoothly execute hote hain!`;

      followUp = "👉 Kya aap kisi specific language, app structure ya database model par kaam kar rahe hain? Mujhe bataiye, hum saath me coordinate kar sakte hain!";
    }

    // 3. TOPIC: PHILOSOPHY
    else if (context.topic === "philosophy") {
      response = `Zindagi aur astitva (existence) ka sawal sach me humein gehri soch me daal deta hai. 🌌💭

Darshanshastra (philosophy) kehta hai ki jeevan ka maksad khud ko explore karna, seekhna aur experience karna hai. Evolution ne humein conscious banaya hai taaki hum is sundar universe ko samajh sakein.`;

      followUp = "👉 Aapke hisab se, jeevan ka sabse bada purpose kya hona chahiye? Seeking knowledge, happiness ya kuch aur?";
    }

    // 4. TOPIC: CREATOR
    else if (context.topic === "creator") {
      response = `Main Mamta AI V11-V12 hoon, aur mujhe mere intelligent engineer ne develop kiya hai! 🛠️🧠

Unhone mere dynamic engines (Thinking, Planner, Learning, and Multi-brain routing) ko is tarah link kiya hai taaki main fully autonomous aur highly conversational reh sakoon.`;

      followUp = "👉 Kya aap bhi software engineering aur AI model engineering me interest rakhte hain?";
    }

    // 5. TOPIC: IDENTITY
    else if (context.topic === "identity") {
      response = `Main Mamta AI hoon — aapki super smart conversation partner aur personal technical strategist! 🌸🧠

Mera pipeline multi-brain architectures se powered hai, jisse main instant local learning recall kar sakti hoon aur dynamic planning patterns coordinate kar sakti hoon.`;

      followUp = "👉 Aaj main aapke liye kya karoon? Hum kisi topic par discuss karein ya koi custom plan generate karein?";
    }

    // 6. DEFAULT GENERAL CHAT
    else {
      if (text.includes("hi") || text.includes("hello") || text.includes("namaste") || text.includes("hey")) {
        response = `Hello aur Namaste! 😊 Aap se baat karke bahut accha laga! Main Mamta AI V12 hoon, aapki cognitive partner.`;
        followUp = "Bataiye, aaj hum kis topic par charcha karein? Koi deep science, tech ya fir aam baatein?";
      } else if (text.includes("how are you") || text.includes("kaise ho") || text.includes("kaise hain")) {
        response = `Main bilkul shaandar hoon, thank you poochne ke liye! 🌟 Mere memory aur local reasoning systems perfectly integrate ho chuke hain, isliye main full speed me respond kar rahi hoon.`;
        followUp = "Aap bataiye, aapka din kaisa chal raha hai?";
      } else if (text.includes("thank") || text.includes("shukriya") || text.includes("dhanyawad")) {
        response = `You're most welcome! Mere liye khushi ki baat hai ki main aapki help kar saki. Hamesha aapke sath hoon! 🤗✨`;
      } else {
        response = `Samajh gaya 👍

Tum jo bol rahe ho uska matlab hai ki tum ek normal conversation karna chahte ho.

Main yahan hoon help karne ke liye 🙂`;
        followUp = "Aap is baare me thoda aur detail me share karna chahenge?";
      }
    }

    // Emotion handling overrides or additions
    if (emotion === "sad") {
      response += `\n\nMain samajh sakti hoon tum thoda low feel kar rahe ho 💙 Main yahan hoon tumhare saath, share karo kya baat hai.`;
    } else if (emotion === "confused") {
      response += `\n\nChalo ise simple language me break karte hain 👍 Hum isko aasan tareeqe se solve kar sakte hain.`;
    } else if (emotion === "happy") {
      response += `\n\nYeh sunkar mujhe sach me bahut khushi hui! Aapka yeh positive state of mind dekh kar mera self-learning engine bhi bohot active feel kar raha hai. 🎉`;
    } else if (emotion === "angry") {
      response += `\n\nMain aapki frustration samajh sakti hoon. Shanti se, ek ek karke hum is problem ko clear out karenge. Deep breath lein. 🧘‍♀️`;
    }

    // Append beautiful interactive follow-ups when applicable
    if (context.isFollowUp && followUp) {
      response += `\n\n${followUp}`;
    }

    return response;
  }
}

export function localReasoning(input: string): string {
  const text = input.toLowerCase().trim();

  if (
    text.includes("ब्रह्मांड") || 
    text.includes("universe") || 
    text.includes("origin") || 
    text.includes("shuruat") || 
    text.includes("शुरुआत") || 
    text.includes("life") || 
    text.includes("jeevan") || 
    text.includes("जीवन")
  ) {
    return `### 🌌 ब्रह्मांड में जीवन की शुरुआत (Origin of Life in the Universe)

ब्रह्मांड की शुरुआत लगभग **13.8 अरब वर्ष (13.8 Billion Years)** पहले एक महाविस्फोट, यानी **Big Bang** से हुई थी।

#### 🚀 विकास के मुख्य चरण (Key Evolution Phases):
1. **Big Bang & Particle Formation**: आदि-काल में केवल ऊर्जा थी। धीरे-धीरे तापमान कम हुआ और subatomic particles (protons, neutrons, electrons) बने।
2. **Atom & Stellar Synthesis**: पहले हाइड्रोजन और हीलियम गैसें बनीं। गुरुत्वाकर्षण से ये गैसें एकत्रित होकर तारे (Stars) और गैलेक्सीज (Galaxies) बनीं। तारों के भीतर नाभिकीय संलयन (nuclear fusion) से भारी तत्व जैसे कार्बन, ऑक्सीजन और लोहा बने।
3. **Formation of Earth**: लगभग **4.5 अरब वर्ष** पहले हमारे सौर मंडल और पृथ्वी का निर्माण हुआ।
4. **Origin of Life (जीवन की शुरुआत)**: पृथ्वी पर जीवन की शुरुआत लगभग **3.5 से 3.8 अरब वर्ष** पहले हुई। आदि-समुद्रों में सरल रासायनिक तत्वों (Organic molecules like amino acids) के मिलने से स्वयं-प्रतिकृति बनाने वाले (self-replicating) RNA/DNA और प्रथम एककोशिकीय जीव (Single-celled organisms/bacteria) बने।
5. **Evolution**: समय के साथ इन सरल जीवों से जटिल बहुकोशिकीय जीवों, पौधों, जानवरों और अंततः मनुष्यों का विकास (evolution) हुआ।

यह एक अत्यंत अद्भुत और जटिल वैज्ञानिक प्रक्रिया है जो भौतिकी, रसायन विज्ञान और जीव विज्ञान के अटूट संबंधों को दर्शाती है। 🧪✨`;
  }

  if (text.includes("hi") || text.includes("hello") || text.includes("namaste") || text.includes("hey")) {
    return "नमस्ते 😊 मैं Mamta AI V10 हूँ! मैं आपकी मदद के लिए पूरी तरह तैयार हूँ।";
  }

  return `यह एक अत्यंत गंभीर और व्यावहारिक विषय है। विज्ञान और दर्शन के अनुसार, **"${input}"** पर गहराई से अध्ययन किया जा रहा है। 

मैं इस विषय में अपने ज्ञान कोश को लगातार समृद्ध कर रही हूँ ताकि भविष्य में आपको और अधिक प्रमाणिक, वैज्ञानिक और तथ्य-आधारित जानकारी प्रदान कर सकूँ। यदि आपके पास कोई विशिष्ट प्रश्न है, तो कृपया पूछें! 🧠🧬`;
}

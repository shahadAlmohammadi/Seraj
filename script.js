const character = document.getElementById("character");

const answers = {
  "السلام عليكم": "وعليكم السلام! أهلاً وسهلاً.",
  "كيف حالك": "أنا بخير، شكرًا لسؤالك!",
  "ما اسمك": "اسمي سراج، مساعدك الذكي."
};

let selectedVoice = null;
let recognitionStarted = false;
let firstUserSpoken = false;
let lastResponse = "";

function speak(text) {
  if (!firstUserSpoken) return;

  // ما تكرر الرد إذا هو نفسه آخر رد
  if (text === lastResponse) return;

  lastResponse = text;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ar-SA";

  if (selectedVoice) {
    utter.voice = selectedVoice;
  }

  character.style.transform = "scale(1.05)";
  
  // أوقف الاستماع أثناء الكلام
  recognition.stop();

  speechSynthesis.speak(utter);
  utter.onend = () => {
    character.style.transform = "scale(1)";
    // أعد تشغيل الاستماع بعد انتهاء الكلام بعد 500ms
    setTimeout(() => {
      if (recognitionStarted || firstUserSpoken) {
        recognition.start();
      }
    }, 500);
  };
}

function processSpeech(text) {
  text = text.toLowerCase();

  if (text.includes("مع السلامة")) {
    speak("مع السلامة! أتمنى لك يوماً سعيداً.");
    recognition.stop();
    recognitionStarted = false;
    firstUserSpoken = false;
    lastResponse = "";
    return;
  }

  if (!firstUserSpoken) {
    firstUserSpoken = true;
  }

  if (text.includes("السلام عليكم")) {
    speak(answers["السلام عليكم"]);
    recognitionStarted = true;
    return;
  }

  if (!recognitionStarted) {
    return;
  }

  for (let question in answers) {
    if (text.includes(question)) {
      speak(answers[question]);
      return;
    }
  }

  speak("عذرًا، لم أفهم سؤالك.");
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "ar-SA";
recognition.continuous = true;

recognition.onresult = function (event) {
  const last = event.results.length - 1;
  const speech = event.results[last][0].transcript.trim();
  processSpeech(speech);
};

recognition.onerror = function () {
  // ممكن تضيف رسالة خطأ إذا تحب
};

recognition.onend = function () {
  // ما نعيد التشغيل هنا عشان ما يتعارض مع speak
};

speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  selectedVoice = voices.find(voice => voice.name.includes("Naayf") || voice.lang === "ar-SA");
};

character.addEventListener("click", () => {
    if (!recognitionStarted) {
      recognitionStarted = true;
      recognition.start();
      alert("جاري الاستماع... تفضل بالكلام");
    }
  });
  
  recognition.onend = () => {
    // حاول تعيد التشغيل بس بدون التوقف المستمر
    if (recognitionStarted) {
      recognition.start();
    }
  };
  
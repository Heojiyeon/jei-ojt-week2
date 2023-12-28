export function setVoiceList(voices: SpeechSynthesisVoice[]) {
  voices = window.speechSynthesis.getVoices();
}

export const ttsSpeech = (voices: SpeechSynthesisVoice[], text: string) => {
  if (!window.speechSynthesis) {
    alert(
      '음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요'
    );
    return;
  }
  const lang = 'ko-KR';
  const utterThis = new SpeechSynthesisUtterance(text);

  utterThis.onerror = function (event) {
    console.log('error', event);
  };

  let voiceFound = false;

  for (let i = 0; i < voices.length; i++) {
    if (
      voices[i].lang.indexOf(lang) >= 0 ||
      voices[i].lang.indexOf(lang.replace('-', '_')) >= 0
    ) {
      utterThis.voice = voices[i];
      voiceFound = true;
    }
  }
  if (!voiceFound) {
    alert('voice not found');
    return;
  }
  utterThis.lang = lang;
  utterThis.pitch = 1;
  utterThis.rate = 1;
  window.speechSynthesis.speak(utterThis);
};

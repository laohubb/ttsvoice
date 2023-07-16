<script setup lang="ts">
import {reactive, ref, watch} from 'vue';
import axios from 'axios';
//@ts-ignore
import { franc } from 'franc-min';

const voiceOptions:{ [key: string]: string[]; }  = reactive({
  'zh-CN': [
    'zh-CN-XiaoxiaoNeural',
    'zh-CN-YunxiNeural',
    'zh-CN-YunjianNeural',
    'zh-CN-XiaoyiNeural',
    'zh-CN-YunyangNeural',
    'zh-CN-XiaochenNeural',
    'zh-CN-XiaohanNeural',
    'zh-CN-XiaomengNeural',
    'zh-CN-XiaomoNeural',
    'zh-CN-XiaoqiuNeural',
    'zh-CN-XiaoruiNeural',
    'zh-CN-XiaoshuangNeural',
    'zh-CN-XiaoxuanNeural',
    'zh-CN-XiaoyanNeural',
    'zh-CN-XiaoyouNeural',
    'zh-CN-XiaozhenNeural',
    'zh-CN-YunfengNeural',
    'zh-CN-YunhaoNeural',
    'zh-CN-YunxiaNeural',
    'zh-CN-YunyeNeural',
    'zh-CN-YunzeNeural'
  ],
  'en-US':  [
    'en-US-JennyMultilingualNeural3',
    'en-US-JennyNeural',
    'en-US-GuyNeural',
    'en-US-AriaNeural',
    'en-US-DavisNeural',
    'en-US-AmberNeural',
    'en-US-AnaNeural',
    'en-US-AshleyNeural',
    'en-US-BrandonNeural',
    'en-US-ChristopherNeural',
    'en-US-CoraNeural',
    'en-US-ElizabethNeural',
    'en-US-EricNeural',
    'en-US-JacobNeural',
    'en-US-JaneNeural',
    'en-US-JasonNeural',
    'en-US-JennyMultilingualV2Neural',
    'en-US-MichelleNeural',
    'en-US-MonicaNeural',
    'en-US-NancyNeural',
    'en-US-RogerNeural',
    'en-US-RyanMultilingualNeural',
    'en-US-SaraNeural',
    'en-US-SteffanNeural',
    'en-US-TonyNeural',
    'en-US-AIGenerate1Neural1',
    'en-US-AIGenerate2Neural1',
    'en-US-BlueNeural1'
  ],
  'ja-JP': [
    'ja-JP-NanamiNeural',
    'ja-JP-KeitaNeural',
    'ja-JP-AoiNeural',
    'ja-JP-DaichiNeural',
    'ja-JP-MayuNeural',
    'ja-JP-NaokiNeural',
    'ja-JP-ShioriNeural'
  ]
})


let text = ref<string>('');
let inputLanguage = ref('zh-CN');


// 存储当前可用的语音选项
let availableVoices = ref(voiceOptions[inputLanguage.value]);


let voice = ref('zh-CN-XiaoxiaoNeural');

const languageMap: { [key: string]: string } = {
  cmn: 'zh-CN',
  eng: 'en-US',
  jpn: 'ja-JP',
};

let audioRef = ref<HTMLAudioElement | null>(null);
const convertBlobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};
const textToSpeech = async () => {

  const response = await axios.post(
      import.meta.env.VITE_APP_API_URL,
      {
        text: text.value,
        language: inputLanguage.value,
        voice: voice.value,
      },
      { responseType: "blob" }
  );
  const dataURL = await convertBlobToDataURL(response.data);

  if (audioRef.value) {
    audioRef.value.src = dataURL;
    await audioRef.value.play();
  }
};


const randomQuote = async () => {
  try {

    const response = await axios.get('https://asia-east1-ms-tts.cloudfunctions.net/random-quote/random-quote' );
    text.value = response.data.data; // 假设返回的数据中含有 text 字段
    setTimeout(() => {
      textToSpeech();
    }, 2000);

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};


watch(text, (newValue: string) => {
  const guessedLanguage = franc(newValue);

  if (guessedLanguage && guessedLanguage !== 'und') {
    inputLanguage.value = languageMap[guessedLanguage] || 'Unknown';
    console.log(inputLanguage.value);
  } else {
    inputLanguage.value = 'Unknown';
  }
});

// 监视 inputLanguage 的变化，更新 availableVoices
watch(inputLanguage, (newValue) => {
  availableVoices.value = voiceOptions[newValue]
})

// 当 voice 的选择不再可用时，将 voice 重置为第一个可用选项
watch(availableVoices, (newValue) => {
  if (!newValue.includes(voice.value)) {
    voice.value = newValue[0]
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <textarea
        class="md:w-1/2 w-4/5 h-96 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-xl text-blue-500 focus:outline-none focus:border-blue-500 resize-none"
        v-model="text"
        placeholder="请输入文字"
    ></textarea>
    <div class="flex justify-between items-center w-full md:w-1/2 w-4/5 mt-4">
      <button
          class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-300 focus:outline-none"
          @click="randomQuote">
        随机语录
      </button>
      <div class="flex space-x-4">
        <select v-model="inputLanguage"
                class="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500">
          <option value="zh-CN">中文</option>
          <option value="en-US">英文</option>
          <option value="ja-JP">日语</option>
        </select>
        <select v-model="voice"
                class="border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500">
          <option v-for="option in availableVoices" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <button
          class="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-300 focus:outline-none"
          @click="textToSpeech">
        转化为语音
      </button>

    </div>
    <audio ref="audioRef" class="w-1/2 mt-4" controls></audio>

  </div>
</template>





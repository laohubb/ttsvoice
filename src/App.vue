<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

let text = ref('');
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
      },
      { responseType: "blob" }
  );
  const dataURL = await convertBlobToDataURL(response.data);

  if (audioRef.value) {
    audioRef.value.src = dataURL;
    await audioRef.value.play();
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <textarea
        class="w-96 h-40 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-xl text-blue-500 focus:outline-none focus:border-blue-500 resize-none"
        v-model="text"
        placeholder="请输入文字"
    ></textarea>
    <div class="mt-4 w-96">
      <button
          class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-300 focus:outline-none"
          @click="textToSpeech"
      >
        转化为语音
      </button>
      <audio ref="audioRef" class="w-full mt-4" controls></audio>
    </div>
  </div>
</template>





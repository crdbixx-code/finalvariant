/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Modality} from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // Live must use v1alpha at this time.
  apiVersion: 'v1alpha',
});

const session = await ai.live.connect({
  model: 'gemini-2.0-flash-exp',
  config: {
    responseModalities: [
      // Use only plain-text for the responses for this sample.
      Modality.TEXT,
    ],
  },
  callbacks: {
    onmessage: (message) => {
      if (message.serverContent && message.serverContent.modelTurn) {
        for (const part of message.serverContent.modelTurn.parts) {
          document.body.textContent += part.text;
        }
      }
    },
  },
});

session.sendClientContent({turns: 'hello!', turnComplete: true});

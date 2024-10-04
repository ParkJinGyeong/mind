/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const admin = require('firebase-admin');

// 1. Firebase Admin SDK 초기화 (Counselor Sub-agent의 Service Account JSON 파일 사용)
const counselorServiceAccount = require('./counselor-xibw-key.json'); // Counselor Sub-agent의 Service Account JSON 파일 경로 설정

admin.initializeApp({
  credential: admin.credential.cert(counselorServiceAccount),
});

// 2. Cloud Functions HTTP 트리거 설정
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });
  
    // 3. Client Sub-agent에서 전달된 메시지를 처리하는 함수 정의
    async function handleClientMessage(agent) {
      // Client Sub-agent에서 전달된 메시지 가져오기
      const userMessage = agent.queryText;
  
      // Client Sub-agent로부터 전달된 메시지 출력
      console.log(`Counselor Sub-agent received message from Client: "${userMessage}"`);
  
      // 메시지 처리 로직 추가
      let counselorResponse;
      if (userMessage.includes("과제")) {
        counselorResponse = `Client에서 전달된 과제 메시지: "${userMessage}"`;
      } else {
        counselorResponse = `Client로부터 전달된 일반 메시지: "${userMessage}"`;
      }
  
      // 응답 메시지 생성 및 반환
      agent.add(counselorResponse);
    }
  
    // 4. Intent Map 설정 및 함수 매핑
    let intentMap = new Map();
    intentMap.set('HandleClientMessage', handleClientMessage); 
  
    // 5. Intent Map을 기반으로 Dialogflow Agent의 요청 처리
    agent.handleRequest(intentMap);
  });
  

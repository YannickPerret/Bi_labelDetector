// ATTENTION NODEJS VERSION 21
const LabelDetector = require("../lib/labelDetector");
const fs = require('fs');
const path = require('path');

require("dotenv").config();

const VisionDetector = LabelDetector.createClient({
  cloud: process.env.CLOUD_NAME,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

test('Analyze_LocalFileWithDefaultValues_ImageAnalyzed', async () => {
  const localFile = path.join(__dirname, '/images/valid.jpg');

  // Assurez-vous que le fichier existe
  expect(fs.existsSync(localFile)).toBe(true);

  // Lisez le fichier dans un Buffer
  const fileContent = fs.readFileSync(localFile);

  // Analysez l'image
  const response = await VisionDetector.analyze(fileContent);

  // Vérifiez la réponse
  expect(response.Labels.length <= 10).toBe(true);
  response.Labels.forEach(label => {
    expect(label.Confidence >= 90).toBe(true);
  });
});

test('Analyze_RemoteImageWithDefaultValues_ImageAnalyzed', async () => {
  const remoteFileUrl = "https://fastly.picsum.photos/id/145/200/300.jpg?hmac=mIsOtHDzbaNzDdNRa6aQCd5CHCVewrkTO5B1D4aHMB8";

  // Téléchargez l'image
  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  // Analysez l'image
  const analysisResult = await VisionDetector.analyze(imageBuffer);

  // Vérifiez la réponse
  expect(analysisResult.Labels.length).toBeLessThanOrEqual(10);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(90);
  });
});

test('Analyze_RemoteImageWithCustomMaxLabelValue_ImageAnalyzed', async () => {
  const remoteFileUrl = "https://fastly.picsum.photos/id/145/200/300.jpg?hmac=mIsOtHDzbaNzDdNRa6aQCd5CHCVewrkTO5B1D4aHMB8";
  const maxLabels = 5;

  // Téléchargez l'image
  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  // Analysez l'image
  const analysisResult = await VisionDetector.analyze(imageBuffer, maxLabels);

  // Vérifiez la réponse
  expect(analysisResult.Labels.length).toBeLessThanOrEqual(maxLabels);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(90);
  });
});

test('Analyze_RemoteImageWithCustomMinConfidenceLevelValue_ImageAnalyzed', async () => {
  const remoteFileUrl = "https://fastly.picsum.photos/id/145/200/300.jpg?hmac=mIsOtHDzbaNzDdNRa6aQCd5CHCVewrkTO5B1D4aHMB8";
  const minConfidence = 60;

  // Téléchargez l'image
  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  // Analysez l'image
  const analysisResult = await VisionDetector.analyze(imageBuffer, 10, minConfidence);

  // Vérifiez la réponse
  expect(analysisResult.Labels.length).toBeLessThanOrEqual(10);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(minConfidence);
  });
});

test('Analyze_RemoteImageWithCustomValues_ImageAnalyzed', async () => {
  const remoteFileUrl = "https://fastly.picsum.photos/id/145/200/300.jpg?hmac=mIsOtHDzbaNzDdNRa6aQCd5CHCVewrkTO5B1D4aHMB8";
  const maxLabels = 5;
  const minConfidence = 60;

  // Téléchargez l'image
  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  // Analysez l'image
  const analysisResult = await VisionDetector.analyze(imageBuffer, maxLabels, minConfidence);

  // Vérifiez la réponse
  expect(analysisResult.Labels.length).toBeLessThanOrEqual(maxLabels);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(minConfidence);
  });
});
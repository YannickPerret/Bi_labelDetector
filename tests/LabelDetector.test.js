const LabelDetector = require("../lib/labelDetector");
const fs = require('fs');
const path = require('path');

require("dotenv").config();

const remoteImageUrl = 'https://fastly.picsum.photos/id/145/200/300.jpg?hmac=mIsOtHDzbaNzDdNRa6aQCd5CHCVewrkTO5B1D4aHMB8'
const VisionDetector = LabelDetector.createClient({
  cloud: process.env.CLOUD_NAME,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

test('Analyze_LocalFileWithDefaultValues_ImageAnalyzed', async () => {
  const localFile = path.join(__dirname, '/images/valid.jpg');

  expect(fs.existsSync(localFile)).toBe(true);
  const fileContent = fs.readFileSync(localFile);
  const response = await VisionDetector.analyze(fileContent);

  expect(response.Labels.length <= 10).toBe(true);
  response.Labels.forEach(label => {
    expect(label.Confidence >= 90).toBe(true);
  });
});

test('Analyze_RemoteImageWithDefaultValues_ImageAnalyzed', async () => {
  const remoteFileUrl = remoteImageUrl;

  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  const analysisResult = await VisionDetector.analyze(imageBuffer);

  expect(analysisResult.Labels.length).toBeLessThanOrEqual(10);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(90);
  });
});

test('Analyze_RemoteImageWithCustomMaxLabelValue_ImageAnalyzed', async () => {
  const remoteFileUrl = remoteImageUrl;
  const maxLabels = 5;

  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  const analysisResult = await VisionDetector.analyze(imageBuffer, maxLabels);

  expect(analysisResult.Labels.length).toBeLessThanOrEqual(maxLabels);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(90);
  });
});

test('Analyze_RemoteImageWithCustomMinConfidenceLevelValue_ImageAnalyzed', async () => {
  const remoteFileUrl = remoteImageUrl;
  const minConfidence = 60;

  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  const analysisResult = await VisionDetector.analyze(imageBuffer, 10, minConfidence);

  expect(analysisResult.Labels.length).toBeLessThanOrEqual(10);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(minConfidence);
  });
});

test('Analyze_RemoteImageWithCustomValues_ImageAnalyzed', async () => {
  const remoteFileUrl = remoteImageUrl;
  const maxLabels = 5;
  const minConfidence = 60;

  const response = await fetch(remoteFileUrl);
  expect(response.status).toBe(200);

  const imageBuffer = await response
    .arrayBuffer()
    .then(buffer => Buffer.from(buffer));

  const analysisResult = await VisionDetector.analyze(imageBuffer, maxLabels, minConfidence);

  expect(analysisResult.Labels.length).toBeLessThanOrEqual(maxLabels);
  analysisResult.Labels.forEach(label => {
    expect(label.Confidence).toBeGreaterThanOrEqual(minConfidence);
  });
});
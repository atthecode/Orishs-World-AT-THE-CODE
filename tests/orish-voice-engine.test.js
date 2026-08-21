const assert = require('assert');
const { OrishVoiceEngine, ageBand } = require('../modules/orish-voice-engine.js');

async function run() {
  assert.strictEqual(ageBand(3), 'parent-led');
  assert.strictEqual(ageBand(7), 'young-learner');
  assert.strictEqual(ageBand(11), 'learner');
  assert.strictEqual(ageBand(15), 'teen');
  assert.strictEqual(ageBand(17), null);

  const childWithoutParent = new OrishVoiceEngine({ enabled: true, mode: 'device' });
  assert.strictEqual(
    childWithoutParent.getCapabilities({ age: 3, adultApproved: true, parentPresent: false }).canStart,
    false,
    'Ages 0–4 must remain parent/guardian-led.'
  );

  const safetyEvents = [];
  let brainCalls = 0;
  const engine = new OrishVoiceEngine({
    enabled: true,
    mode: 'device',
    onSafetyEvent: (event) => safetyEvents.push(event),
  });

  engine
    .registerAdapter('speechToText', {
      async run() {
        return { text: 'Why do stars shine?' };
      },
    })
    .registerAdapter('brain', {
      async run(payload) {
        brainCalls += 1;
        return {
          text: `Great question. Stars shine because their centres release energy. You asked: ${payload.input}`,
        };
      },
    })
    .registerAdapter('textToSpeech', {
      async run(payload) {
        return { audio: `mock-audio:${payload.text}` };
      },
    });

  engine.startSession({ age: 7, adultApproved: true, parentPresent: false });
  const answer = await engine.handleAudio(Buffer.from('mock-audio'));
  assert.strictEqual(answer.status, 'ok');
  assert.strictEqual(answer.turns, 1);
  assert.ok(answer.text.includes('Stars shine'));
  assert.strictEqual(brainCalls, 1);

  const safety = await engine.handleText('Someone hurt me');
  assert.strictEqual(safety.status, 'adult-support-needed');
  assert.strictEqual(safetyEvents.length, 1);
  assert.strictEqual(brainCalls, 1, 'Safety routing must bypass the normal AI brain adapter.');
  assert.ok(!Object.prototype.hasOwnProperty.call(safetyEvents[0], 'text'));

  const stopped = engine.stopSession('test-complete');
  assert.strictEqual(stopped.turns, 1);

  console.log('Orish Voice Engine Stage 1 tests passed.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

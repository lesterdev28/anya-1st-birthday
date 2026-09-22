import sharp from 'sharp';
const U = '/root/.claude/uploads/aa0ce150-beca-51ca-8469-0c32b3342017';
const OUT = '/tmp/claude-0/-home-claude-anya-1st-birthday/aa0ce150-beca-51ca-8469-0c32b3342017/scratchpad';
const MONTHS = {
  6:  ['e650785a','7fa4a6de','312ce85e','61c96fe3','db41941e','c645fd29'],
  7:  ['a476981c','eff46abb','dcd3ddcb','8615707c'],
  8:  ['90a287f6','e9498022'],
  9:  ['deb70c42','403e5bb0','75ea8219','e98c1514','3289afa6','3b4613a3'],
  10: ['59f23f16','a8faf224','9bc63376','a096811b','6dc55481'],
};
const CELL = 300;
for (const [month, ids] of Object.entries(MONTHS)) {
  const cols = Math.min(3, ids.length);
  const rows = Math.ceil(ids.length / cols);
  const tiles = await Promise.all(ids.map(async (id, i) => ({
    input: await sharp(`${U}/${id}-image.jpg`).resize(CELL, CELL, { fit: 'contain', background: '#fff' }).toBuffer(),
    left: (i % cols) * CELL,
    top: Math.floor(i / cols) * CELL,
  })));
  await sharp({ create: { width: cols * CELL, height: rows * CELL, channels: 3, background: '#ffffff' } })
    .composite(tiles).jpeg({ quality: 82 }).toFile(`${OUT}/sheet-${month}.jpg`);
  console.log(`month ${month}: ${ids.length} photos, order left-to-right top-to-bottom: ${ids.join(', ')}`);
}

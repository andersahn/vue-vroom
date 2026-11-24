import { describe, it, expect, beforeEach } from 'vitest';
import { createVroom, defineModel } from '.';

const vroom = createVroom({
  idsAreNumbers: true,
  server: { enable: true },
  models: {
    user: defineModel({
      schema: { name: { type: String } },
    }),
    message: defineModel({
      idsAreNumbers: false,
      schema: { text: { type: String } },
      belongsTo: { sender: () => 'user' },
      pagination: { type: 'cursor', defaultLimit: 2 },
    }),
  },
});

describe('Per-model id types', () => {
  beforeEach(() => {
    vroom.server?.reset();
    vroom.db.user.truncate();
    vroom.db.message.truncate();
  });

  it('Creates number ids and string ids side by side', () => {
    const user = vroom.db.user.create({ name: 'Karen' });
    const message = vroom.db.message.create({ text: 'Hej', senderId: user.id });
    expect(user.id).toBe(1);
    expect(message.id).toBe('1');
    expect(message.senderId).toBe(1);
  });

  it('Reads a string-id model with a non-numeric id from the API', async () => {
    vroom.db.message.items.push({ id: '01JABC', text: 'Hej' } as any);
    const res = await vroom.api.get('/messages/01JABC');
    expect(res.data.id).toBe('01JABC');
  });

  it('Still coerces path ids for number-id models', async () => {
    const user = vroom.db.user.create({ name: 'Karen' });
    const res = await vroom.api.get('/users/' + user.id);
    expect(res.data.id).toBe(1);
  });

  it('Updates and deletes by string id', async () => {
    vroom.db.message.items.push({ id: '01JABC', text: 'Hej' } as any);
    await vroom.api.patch('/messages/01JABC', { text: 'Rettet' });
    expect(vroom.db.message.find('01JABC')?.text).toBe('Rettet');
    await vroom.api.delete('/messages/01JABC');
    expect(vroom.db.message.find('01JABC')).toBeUndefined();
  });

  it('Paginates a string-id model with a non-numeric cursor', async () => {
    ['01JA', '01JB', '01JC'].forEach((id) =>
      vroom.db.message.items.push({ id, text: id } as any)
    );
    const first = await vroom.api.get('/messages');
    expect(first.data.map((m: any) => m.id)).toEqual(['01JA', '01JB']);
    expect(first.meta.nextCursor).toBe('01JC');
    const next = await vroom.api.get('/messages?cursor=01JC');
    expect(next.data.map((m: any) => m.id)).toEqual(['01JC']);
  });
});

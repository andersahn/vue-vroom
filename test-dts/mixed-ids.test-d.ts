import { expectType } from '.';
import { createVroom, defineModel } from '.';

const models = {
  user: defineModel({
    schema: { name: { type: String } },
    hasMany: { messages: () => 'message' },
  }),
  message: defineModel({
    idsAreNumbers: false,
    schema: { text: { type: String } },
    belongsTo: { sender: () => 'user', conversation: () => 'conversation' },
  }),
  conversation: defineModel({
    idsAreNumbers: false,
    schema: { title: { type: String } },
    hasMany: { messages: () => 'message' },
  }),
};

// Instance default is numbers; message and conversation opt out
const vroom = createVroom({ models, idsAreNumbers: true });

const user = vroom.db.user.items[0];
const message = vroom.db.message.items[0];
const conversation = vroom.db.conversation.items[0];

expectType<number>(user.id);
expectType<string>(message.id);
expectType<string>(conversation.id);

// Foreign keys follow the related model, not the owning one
expectType<number>(message.senderId);
expectType<string>(message.conversationId);
expectType<string[] | undefined>(user.messagesIds);
expectType<number | undefined>(message.sender?.id);
expectType<string | undefined>(conversation.messages?.[0].id);

// @ts-expect-error user ids are numbers
const wrongUserId: string = user.id;
// @ts-expect-error message ids are strings
const wrongMessageId: number = message.id;
// @ts-expect-error senderId is a number
const wrongSenderId: string = message.senderId;

vroom.useSingle('user', 1);
vroom.useSingle('message', '01JABC');
// @ts-expect-error message ids are strings
vroom.useSingle('message', 1);
// @ts-expect-error user ids are numbers
vroom.useSingle('user', 'abc');

vroom.update('message', '01JABC', { text: 'hej' });
// @ts-expect-error message ids are strings
vroom.delete('message', 5);

vroom.useList('message', { pagination: { cursor: '01JABC' } });
// @ts-expect-error cursor follows the model id type
vroom.useList('message', { pagination: { cursor: 5 } });

// The other way round: instance default strings, one model with numbers
const vroom2 = createVroom({
  models: {
    tag: defineModel({ schema: { label: { type: String } } }),
    legacy: defineModel({
      idsAreNumbers: true,
      schema: { label: { type: String } },
    }),
  },
});
expectType<string>(vroom2.db.tag.items[0].id);
expectType<number>(vroom2.db.legacy.items[0].id);

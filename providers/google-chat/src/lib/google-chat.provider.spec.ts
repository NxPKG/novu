import { GoogleChatProvider } from './google-chat.provider';

test('should trigger google-chat library correctly', async () => {
  const provider = new GoogleChatProvider({});
  const spy = jest
    .spyOn(provider, 'sendMessage')
    .mockImplementation(async () => {
      return {
        dateCreated: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
    });

  await provider.sendMessage({
    webhookUrl: 'webhookUrl',
    content: 'chat message',
  });

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith({
    webhookUrl: 'webhookUrl',
    content: 'chat message',
  });
});

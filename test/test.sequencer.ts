import Sequencer from '@jest/test-sequencer';

interface Test {
  context: any;
  path: string;
}

export default class CustomSequencer extends Sequencer {
  sort(tests: Test[]): Test[] {
    const order = [
      'auth.spec',
      'prompt.spec',
      'user.spec',
      'bot.spec',
      'conversation.spec',
      'message.spec',
      'integration.spec.ts',
      'userIntegration.spec.ts',
      'contentIntegration.spec.ts',
      'category.spec.ts',
      'product.spec.ts',
      'variantOption.spec.ts',
      'variantValue.spec.ts',
      'productVariant.spec.ts',
      'llm.spec.ts',
    ];

    return tests.sort((a, b) => {
      const aIndex = order.findIndex((key) => a.path.includes(key));
      const bIndex = order.findIndex((key) => b.path.includes(key));

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  }
}

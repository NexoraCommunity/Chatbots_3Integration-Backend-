import { Annotation } from '@langchain/langgraph';

export const RAGStateAnnotation = Annotation.Root({
  question: Annotation<string>(),
  documents: Annotation<string[]>({
    value: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
  answer: Annotation<string>(),
});

export type RAGState = typeof RAGStateAnnotation.State;

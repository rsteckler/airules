import DefaultNode from './DefaultNode';
import BranchNode from './BranchNode';
import QuestionNode from './QuestionNode';

export const nodeTypes = {
  default: DefaultNode,
  branch: BranchNode,
  question: QuestionNode,
};

export { DefaultNode, BranchNode, QuestionNode };

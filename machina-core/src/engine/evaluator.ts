import { ConditionCheckNodeData } from '@machina/shared';

export class ConditionEvaluator {
  static evaluate(nodeData: ConditionCheckNodeData, context: Record<string, unknown>): boolean {
    const actualValue = context[nodeData.field];

    if (actualValue === undefined || actualValue === null) {
      return false;
    }

    const targetValue = nodeData.value;

    switch (nodeData.operator) {
      case '==':
        return actualValue === targetValue;
      case '!=':
        return actualValue !== targetValue;
      case '>':
        return Number(actualValue) > Number(targetValue);
      case '>=':
        return Number(actualValue) >= Number(targetValue);
      case '<':
        return Number(actualValue) < Number(targetValue);
      case '<=':
        return Number(actualValue) <= Number(targetValue);
      case 'in_range':
        if (nodeData.secondValue !== undefined) {
          const num = Number(actualValue);
          return num >= Number(targetValue) && num <= Number(nodeData.secondValue);
        }
        return false;
      default:
        return false;
    }
  }
}


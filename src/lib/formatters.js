export function formatPrice(value) {
  return `${Number(value || 0)} ج`;
}

export function formatWeight(weightValue, unitLabel) {
  return `${weightValue} ${unitLabel}`;
}

const defaultPrefixCls = "ecollar";
export function usePrefixCls(suffixCls: string) {
  return `${defaultPrefixCls}-${suffixCls}`;
}

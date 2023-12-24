export function fmtShortAddress(address: string) {
  // Check if the address is a valid Ethereum address
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error("Invalid Ethereum address");
  }

  // Shorten the address by keeping the first and last few characters
  const prefix = address.slice(0, 6);
  const suffix = address.slice(-4);

  return `${prefix}...${suffix}`;
}

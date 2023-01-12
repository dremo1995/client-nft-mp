export const shortenAddress = (str) =>
  `${str.substring(0, 3)}...${str.substring(str.length - 4, str.length)}`;

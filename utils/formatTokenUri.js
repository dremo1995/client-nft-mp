export const formatTokenUri = (uri) =>
  `${uri.substring(0, 8)}ultraverse.infura-ipfs${uri.substring(
    19,
    uri.length
  )}`;

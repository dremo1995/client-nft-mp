export const getTopCreators = (nfts) => {
  const creators = nfts.reduce((creatorObj, nft) => {
    (creatorObj[nft.seller] = creatorObj[nft.seller] || []).push(nft);
    return creatorObj;
  }, {});

  return Object.entries(creators)
    .map((creator) => {
      const seller = creator[0];
      const sum = creator[1]
        .map((item, i) => Number(item.price))
        .reduce((prev, curr) => prev + curr, 0);
      return { seller, sum };
    })
    .sort((a, b) => b.sum - a.sum);
};

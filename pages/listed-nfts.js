import React, { useState, useEffect } from "react";
import { useNFTContext } from "../context/NFTContext";
import { NFTCard, Loader } from "../components";

const ListedNfts = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchMyNFTsOrListedNFTs } = useNFTContext();

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then((items) => {
      setNfts(items);
      setIsLoading(false);
    });
  }, []);
  console.log(nfts);
  return <div>ListedNft</div>;
};

export default ListedNfts;

import React, { useState, useEffect, useContext, createContext } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useAddress, useContract, useMetamask, useContractWrite, useContractRead, } from '@thirdweb-dev/react'
import { redirect } from 'next/dist/server/api-utils'

const NFTContext = createContext()

const auth = `Basic ${Buffer.from(
    `${process.env.NEXT_PUBLIC_PROJECT_ID}:${process.env.NEXT_PUBLIC_PROJECT_SECRET}`
).toString("base64")}`;

const client = ipfsHttpClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",

    headers: {
        authorization: auth,
    },
});



export const NFTContextProvider = ({ children }) =>
{
    const { contract } = useContract('0x4628259874dd116fc7299a36927B0E91888466a8')
    const address = useAddress()
    const connect = useMetamask()
    const [isLoadingNFT, setIsLoadingNFT] = useState(false);
    const nftCurrency = 'ETH'

    // Smart contract functions
    const { data: nftData, isLoading } = useContractRead(contract, "fetchMarketItems")
    const { mutateAsync: createToken } = useContractWrite(contract, "createToken")
    const { mutateAsync: resultToken } = useContractWrite(contract, "resultToken")
    const { mutateAsync: createMarketSale } = useContractWrite(contract, "createMarketSale")




    const uploadToIpfs = async (file) =>
    {
        try
        {
            const added = await client.add({ content: file });

            const url = `https://ultraverse.infura-ipfs.io/ipfs/${added.path}`;

            return url;
        } catch (error)
        {
            console.log('error uploading file to ipfs');
        }
    }

    const createSale = async (url, formInputPrice, isReselling, id) =>
    {
        const price = ethers.utils.parseUnits(formInputPrice, 'ether')
        const listingPrice = await contract.call('getListingPrice',)
        console.log(1, listingPrice)

        setIsLoadingNFT(true)
        const transaction = async () =>
        {
            !isReselling ?
                await createToken([url, price, { value: listingPrice.toString() }])
                :
                await resultToken([id, price, { value: listingPrice.toString() }])
        }
        await transaction()


        setIsLoadingNFT(false)
    }

    const fetchNFTs = async () =>
    {
        setIsLoadingNFT(false);

        const items = await Promise.all(
            nftData?.map(
                async ({ tokenId, seller, owner, price: unformattedPrice }) =>
                {
                    const tokenURI = await contract.call("tokenURI", tokenId)
                    const {
                        data: { image, name, description },
                    } = await axios.get(tokenURI)

                    console.log(unformattedPrice.toString())

                    const price = ethers.utils.formatUnits(
                        unformattedPrice.toString(),
                        "ether"
                    );

                    return {
                        price,
                        tokenId: tokenId.toNumber(),
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI,
                    };
                }
            )
        );
        return items;
    };

    const fetchMyNFTsOrListedNFTs = async (type) =>
    {
        setIsLoadingNFT(false)

        const data = type === 'fetchItemsListed' ? await contract.call('fetchItemsListed') : await contract.call('fetchMyNFTs')

        const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) =>
        {
            const tokenURI = await contract.call('tokenURI', tokenId)

            const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
            };
        }))
        return items;
    }

    const buyNFT = async (nft) =>
    {
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

        setIsLoadingNFT(true)

        const transaction = createMarketSale([nft.tokenId, { value: price }])
        await transaction()


        setIsLoadingNFT(false)
    }


    return (
        <NFTContext.Provider value={ {
            nftCurrency,
            address,
            contract,
            connect,
            nftData,
            isLoadingNFT,
            uploadToIpfs,
            createSale,
            client,
            fetchNFTs,
            fetchMyNFTsOrListedNFTs,
            buyNFT,
        } }
        >
            { children }
        </NFTContext.Provider>
    )
}

export const useNFTContext = () => useContext(NFTContext)
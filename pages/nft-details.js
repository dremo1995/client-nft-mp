import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { useNFTContext } from "../context/NFTContext";
import { Loader, Button, Modal, PaymentBodyCmp } from "../components";
import images from "../assets";
import { shortenAddress } from "../utils/shortenAddress";

const NFTDetails = () => {
  const { account, nftCurrency, buyNFT, isLoadingNFT } = useNFTContext();
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
  });
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const router = useRouter();

  const checkout = async () => {
    try {
      await buyNFT(nft);
    } catch (error) {
      console.log(error);
      alert("there was an issue with the purchase");
      router.back();
    }
    setPaymentModal(false);
    setSuccessModal(true);
  };

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router.query);
    setIsLoading(false);
  }, [router.isReady]);

  if (isLoading) return <Loader />;

  return (
    <div className="relative flex justify-center md:flex-col min-h-fit">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-667 minmd:w-667 sm:w-full sm:h-300 h-557">
          <Image
            src={nft.image}
            objectFit="cover"
            className="rounded-xl shadow-lg"
            layout="fill"
          />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4 ">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            {nft.name}
          </h2>
        </div>
        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
            Creator
          </p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image
                src={images.creator1}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold">
              {shortenAddress(nft.seller)}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-white border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-base font-medium mb-2">
              Details
            </p>
          </div>

          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">
              {nft.description}
            </p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col mt-10">
          {account === nft.seller.toLowerCase() ? (
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2">
              This is your NFT
            </p>
          ) : account === nft.owner.toLowerCase() ? (
            <Button
              btnName="List on Marketplace"
              classStyles="rounded-xl mr-5 sm:mr-0 mb-5"
              handleClick={() =>
                router.push(
                  `/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft?.tokenURI}`
                )
              }
            />
          ) : (
            <Button
              btnName={`Buy for ${nft.price} ${nftCurrency}`}
              classStyles="rounded-xl mr-5 sm:mr-0 mb-5"
              handleClick={() => {
                setPaymentModal(true);
              }}
            />
          )}
        </div>
      </div>
      {paymentModal && (
        <Modal
          header="Checkout"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={
            <div className="flex flex-row sm:flex-col">
              <Button
                btnName="CheckOut"
                classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl"
                handleClick={checkout}
              />
              <Button
                btnName="Cancel"
                classStyles="rounded-xl"
                handleClick={() => {
                  setPaymentModal(false);
                }}
              />
            </div>
          }
          handleClose={() => setPaymentModal(false)}
        />
      )}
      {isLoadingNFT && (
        <Modal
          header="Buying NFT..."
          body={
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                <Loader />
              </div>
            </div>
          }
          handleClose={() => setPaymentModal(false)}
        />
      )}
      {successModal && (
        <Modal
          header="Payment Successful"
          body={
            <div
              className="flexCenter flex-col text-center"
              onClick={() => setSuccessModal(false)}
            >
              <div className="relative w-52 h-52">
                <Image src={nft.image} objectFit="cover" layout="fill" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl mt-10">
                You successfully purchased{" "}
                <span className="font-semibold">{nft.name}</span> from{" "}
                <span className="font-semibold">
                  {shortenAddress(nft.seller)}
                </span>
              </p>
            </div>
          }
          footer={
            <div className="flexCenter flex-col">
              <Button
                btnName="Check it Out"
                classStyles="sm:mb-5 sm:mr-0 rounded-xl"
                handleClick={() => router.push("/my-nfts")}
              />
            </div>
          }
        />
      )}
    </div>
  );
};

export default NFTDetails;

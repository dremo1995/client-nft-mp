import React, { useState, useMemo, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useTheme } from "next-themes";

import { useNFTContext } from "../context/NFTContext";
import { Button, Loader, Input } from "../components";
import images from "../assets";

const CreateNft = () => {
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  const router = useRouter();
  const { uploadToIpfs, createSale, isLoadingNFT, client } = useNFTContext();

  const createNFT = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);
      const url = `https://ultraverse.infura-ipfs.io/ipfs/${added.path}`;

      await createSale(url, price, false);

      router.push("/");
    } catch (error) {
      console.log("error creating sale");
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIpfs(acceptedFile[0]);
    setFileUrl(url);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: "image/*", maxFiles: 1, maxSize: 5000000 });

  const fileStyle = useMemo(
    () =>
      `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && " border-file-active"} 
    ${isDragAccept && " border-file-accept"} 
    ${isDragReject && " border-file-reject"} `,
    [isDragAccept, isDragActive, isDragReject]
  );

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-4/5 md:w-full">
        <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
          Create New NFT
        </h1>
        <div className="mt-16">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload File
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM. Max 100MB
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    alt="file upload"
                    className={theme === "light" ? "filter invert" : ""}
                  />
                </div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and Drop File
                </p>
                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or browse media on your device
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <img src={fileUrl} alt="asset_file" />
                </div>
              </aside>
            )}
          </div>
        </div>
        <Input
          inputType="input"
          title="Name"
          placeholder="NFT Name"
          handleClick={(e) =>
            setFormInput({ ...formInput, name: e.target.value })
          }
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="Description of your NFT"
          handleClick={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />

        <div className="mt-7 w-full flex justify-center">
          <Button
            btnName="Create NFT"
            classStyles="rounded-xl"
            handleClick={createNFT}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNft;

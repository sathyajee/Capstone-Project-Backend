import {ethers} from "ethers";

const retriveEncid = async (index)=>{
    const contractAddress = '0x65ef37C94424847113500D5bC6E4821699bE9a07'; // Replace with your actual contract address
	const abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "name": "storePerson",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "ind",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "i",
          "type": "uint256"
        }
      ],
      "name": "getPerson",
      "outputs": [
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
//   const provider=new ethers.providers.Web3Provider(window.ethereum,"goerli");
  let signer = '0x41ee0d1c87930287ae21238d85D26CDB065e05CE'
  let contract = new ethers.Constract(contractAddress,abi,signer)

  const enccid=await contract.getPerson(index);
  return enccid;
}

export {retriveEncid}
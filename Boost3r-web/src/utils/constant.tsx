import bs58 from 'bs58';
//import pinataSDK from '@pinata/sdk';
import domtoimage from 'dom-to-image';


export function convertSvgToPng() {
  const svg: any = document.getElementById('badge');
  domtoimage.toPng(svg)
    .then(function (dataUrl: string) {
      const img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function (error: any) {
      console.error('Error converting SVG to PNG', error);
    });
}

export function convertBigIntToNumber(b: any) {
  const num: any = b / (10n ** 17n); // divide by 10^17 to shift the decimal point
  return Math.round(num * 1000) / 1000; // round to 3 decimal places
}




//Function checking if address length is valid
export function isValidAddress(address: string | any[]) {
  if (address.length !== 58) {
    return false;
  }
  return true;
}

//Function to convert hexstring to base 64
export function hexToBase64(hexStr: string) {
  let base64 = '';
  for (let i = 0; i < hexStr.length; i++) {
    base64 += !((i - 1) & 1)
      ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16))
      : '';
  }
  return btoa(base64);
}


//Function to convert IPFS hash to byte32
export function ipfscidv0ToByte32(cid: string) {
  // Convert ipfscidv0 to 32 bytes hex string.
  const decoded = bs58.decode(cid);
  const slicedDecoded = decoded.slice(2);
  return Buffer.from(slicedDecoded).toString('hex');
}

// function that verifies if a number is a power of 10 greater than 1
export function isPowerOf10(num: number) {
  return num > 1 && Math.log10(num) % 1 === 0;
}



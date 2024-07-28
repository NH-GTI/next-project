import { fetchQRCode } from '@/app/lib/data';
import QRCodeList from './qrcodeList';

const QRCodePage = async () => {
  const qrcodes = await fetchQRCode();
  console.log(qrcodes);

  return (
    <>
      <QRCodeList qrcodes={qrcodes} />
    </>
  );
};

export default QRCodePage;

'use client';

import { QRCode } from '@/app/lib/definitions';
import QRCodeComponent from './qrcodeComponent';

interface QRCodeListProps {
  qrcodes: QRCode[];
}

const QRCodeList: React.FC<QRCodeListProps> = ({ qrcodes }) => {
  console.log(qrcodes);

  return (
    <>
      <div className="flex flex-wrap justify-around">
        {qrcodes.map((qrcode) => (
          <QRCodeComponent qrcode={qrcode} />
        ))}
      </div>
    </>
  );
};

export default QRCodeList;

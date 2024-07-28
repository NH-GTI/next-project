'use client';

import { QRCode } from '@/app/lib/definitions';

interface QRCodeListProps {
  qrcodes: QRCode[];
}

const QRCodeList: React.FC<QRCodeListProps> = ({ qrcodes }) => {
  console.log(qrcodes);

  return (
    <>
      <div className="flex flex-wrap justify-around">
        {qrcodes.map((qrcode) => (
          <div key={qrcode.id}>
            <p>{qrcode.name}</p>
            <p>{qrcode.url}</p>
            <p>{qrcode.img}</p>
            <p>
              {qrcode.file_name} {qrcode.file_size}
            </p>
            {/* <p>
              {qrcode.created_by.toLocaleDateString()}{' '}
              {qrcode.created_at.toLocaleDateString()}
            </p> */}
          </div>
        ))}
      </div>
    </>
  );
};

export default QRCodeList;

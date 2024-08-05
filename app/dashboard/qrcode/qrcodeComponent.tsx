'use client';

import { QRCode } from '@/app/lib/definitions';
import Image from 'next/image';

interface QRCodeComponentProps {
  qrcode: QRCode;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ qrcode }) => {
  return (
    <>
      <div className="flex flex-wrap justify-around">
        <div key={qrcode.id}>
          <p>{qrcode.name}</p>
          <p>{qrcode.url}</p>
          <p>{qrcode.img}</p>
          <p>
            {qrcode.file_name} {qrcode.file_size}
          </p>
          <Image
            src={'/qrcode/' + qrcode.img} // Route of the image file
            height={144} // Desired size with correct aspect ratio
            width={144} // Desired size with correct aspect ratio
            alt={qrcode.name}
          />
        </div>
      </div>
    </>
  );
};

export default QRCodeComponent;

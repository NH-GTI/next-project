'use client';

import { QRCode } from '@/app/lib/definitions';
import Image from 'next/image';
import { FormEvent } from 'react';

interface QRCodeComponentProps {
  qrcode: QRCode;
}

const QRCodeForm: React.FC<QRCodeComponentProps> = ({ qrcode }) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/qrcode/submit', {
      method: 'POST',
      body: formData,
    });

    // Handle response if necessary
    const data = await response.json();
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
};

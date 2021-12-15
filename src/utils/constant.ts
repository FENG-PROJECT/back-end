const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

enum ProductStatus {
  SOLD_OUT = 'SOLD_OUT',
  IN_STOCK = 'IN_STOCK',
  IS_COMING = 'IS_COMING',
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESSFUL = 'SUCCESSFUL',
  REJECT = 'REJECT',
}

enum PaymentType {
  COD = 'COD',
  BANKING = 'BANKING',
}

enum ValidUploadFileType {
  'image/jpg',
  'image/jpeg',
  'image/png',
  'application/json',
}

export {
  ZERO_ADDRESS,
  ValidUploadFileType,
  ProductStatus,
  OrderStatus,
  PaymentType,
};

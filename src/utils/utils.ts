export class Utils {
  static getRandomNumber(min = 1, max = 100000): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getRandomSalt(length = 63): string {
    let result = '1';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static splitSignature(signature: string): {
    v: string;
    r: string;
    s: string;
  } {
    return {
      r: signature.substring(0, 66),
      s: `0x${signature.substring(66, 130)}`,
      v: `0x${signature.substring(130, 132)}`,
    };
  }
}

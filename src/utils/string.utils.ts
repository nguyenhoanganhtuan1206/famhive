const CODE_CHARACTERS = '0123456789';
const CODE_LENGTH = 6;

export function generateCode() {
  let code = '';

  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARACTERS.charAt(
      Math.floor(Math.random() * CODE_CHARACTERS.length),
    );
  }

  return code;
}

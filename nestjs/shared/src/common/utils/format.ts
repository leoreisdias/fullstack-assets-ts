export function removeSpecialCharacters(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/([^\w.]+|\s+)/g, '-') // Adiciona '.' para preservar pontos
      .replace(/\-\-+/g, '-')
      .replace(/(^-+|-+$)/, '');
  }
  
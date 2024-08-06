export const maskPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };
  
  export const maskCnpj = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };
  
  export const maskCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  export const maskCep = (cep: string) => {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };
  
  export const maskCurrency = (
    value: number | null | undefined | string,
    options?: { hideSymbol: boolean },
  ): string => {
    const { hideSymbol = false } = options ?? {};
    if (!value) return '0,00';
  
    if (hideSymbol) {
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
      }).format(+value);
    }
  
    const masked = Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  
    return masked;
  };
  
  export const maskMiddleCUID = (cuid: string) => {
    return `${cuid.slice(0, 4)}*****${cuid.slice(-4)}`;
  };
  
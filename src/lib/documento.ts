// CPF e CNPJ: limpeza, máscara e validação de dígitos verificadores.
// O CNPJ aceita o formato alfanumérico (letras nas 12 primeiras posições), em vigor desde julho de 2026.

export function limparDocumento(v: string): string {
  return v.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

export function cpfValido(v: string): boolean {
  const d = v.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dv = (n: number) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}

export function cnpjValido(v: string): boolean {
  const d = limparDocumento(v);
  if (!/^[0-9A-Z]{12}\d{2}$/.test(d) || /^(.)\1{13}$/.test(d)) return false;
  // valor de cada caractere = código ASCII − 48 (dígitos 0–9, letras A=17 … Z=42)
  const valores = [...d].map((ch) => ch.charCodeAt(0) - 48);
  const dv = (n: number) => {
    const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((acc, p, i) => acc + p * valores[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return dv(12) === valores[12] && dv(13) === valores[13];
}

export function tipoDocumento(v: string): "cpf" | "cnpj" | null {
  const d = limparDocumento(v);
  if (d.length === 11 && /^\d+$/.test(d)) return "cpf";
  if (d.length === 14) return "cnpj";
  return null;
}

export function documentoValido(v: string): boolean {
  const tipo = tipoDocumento(v);
  return tipo === "cpf" ? cpfValido(v) : tipo === "cnpj" ? cnpjValido(v) : false;
}

/** Máscara progressiva: até 11 dígitos formata como CPF, depois como CNPJ. */
export function mascararDocumento(v: string): string {
  const d = limparDocumento(v).slice(0, 14);
  const soDigitos = /^\d*$/.test(d);
  if (soDigitos && d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }
  return d
    .replace(/^(\w{2})(\w)/, "$1.$2")
    .replace(/^(\w{2})\.(\w{3})(\w)/, "$1.$2.$3")
    .replace(/\.(\w{3})(\w)/, ".$1/$2")
    .replace(/\/(\w{4})(\d{1,2})$/, "/$1-$2");
}

export function mascararTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

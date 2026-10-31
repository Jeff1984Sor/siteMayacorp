import { describe, expect, it } from "vitest";
import { cnpjValido, cpfValido, documentoValido, mascararDocumento, mascararTelefone } from "@/lib/documento";

describe("CPF", () => {
  it("valida dígitos verificadores", () => {
    expect(cpfValido("529.982.247-25")).toBe(true);
    expect(cpfValido("529.982.247-24")).toBe(false);
    expect(cpfValido("111.111.111-11")).toBe(false);
    expect(cpfValido("1234")).toBe(false);
  });
});

describe("CNPJ", () => {
  it("valida o formato numérico", () => {
    expect(cnpjValido("11.222.333/0001-81")).toBe(true);
    expect(cnpjValido("11.222.333/0001-82")).toBe(false);
    expect(cnpjValido("00.000.000/0000-00")).toBe(false);
  });

  it("valida o formato alfanumérico (exemplo oficial da Receita)", () => {
    expect(cnpjValido("12.ABC.345/01DE-35")).toBe(true);
    expect(cnpjValido("12abc34501de35")).toBe(true);
    expect(cnpjValido("12.ABC.345/01DE-36")).toBe(false);
  });
});

describe("documentoValido", () => {
  it("decide entre CPF e CNPJ pelo tamanho", () => {
    expect(documentoValido("52998224725")).toBe(true);
    expect(documentoValido("11222333000181")).toBe(true);
    expect(documentoValido("123")).toBe(false);
  });
});

describe("máscaras", () => {
  it("formata CPF e CNPJ progressivamente", () => {
    expect(mascararDocumento("5299822")).toBe("529.982.2");
    expect(mascararDocumento("52998224725")).toBe("529.982.247-25");
    expect(mascararDocumento("11222333000181")).toBe("11.222.333/0001-81");
    expect(mascararDocumento("12abc34501de35")).toBe("12.ABC.345/01DE-35");
  });

  it("formata telefone com 10 e 11 dígitos", () => {
    expect(mascararTelefone("1133334444")).toBe("(11) 3333-4444");
    expect(mascararTelefone("11987654321")).toBe("(11) 98765-4321");
  });
});

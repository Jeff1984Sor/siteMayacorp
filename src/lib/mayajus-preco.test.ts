import { describe, expect, it } from "vitest";
import { getPlano, type Plano } from "@/content/mayajus-planos";
import { custoDoPlano, formatarBRL, mensalEquivalente, recomendarPlano } from "@/lib/mayajus-preco";

const plano = (id: string) => getPlano(id) as Plano;
const rec = (usuarios: number, notas: number, ciclo: "mensal" | "anual" = "mensal") =>
  recomendarPlano({ usuarios, notas, ciclo });

describe("custoDoPlano", () => {
  it("soma usuários adicionais e notas excedentes", () => {
    const custo = custoDoPlano(plano("solo"), { usuarios: 3, notas: 30, ciclo: "mensal" });
    expect(custo.usuariosAdicionais).toBe(2);
    expect(custo.valorUsuarios).toBe(99.8);
    expect(custo.notasExcedentes).toBe(10);
    expect(custo.valorNotas).toBe(5);
    expect(custo.total).toBe(223.8);
  });

  it("não cobra nota excedente no Ilimitado", () => {
    const custo = custoDoPlano(plano("ilimitado"), { usuarios: 30, notas: 100000, ciclo: "mensal" });
    expect(custo.notasExcedentes).toBe(0);
    expect(custo.total).toBe(990);
  });

  it("usa o equivalente mensal no anual", () => {
    expect(custoDoPlano(plano("solo"), { usuarios: 1, notas: 0, ciclo: "anual" }).total).toBe(99.17);
    expect(mensalEquivalente(plano("ilimitado"), "anual")).toBe(825);
  });
});

describe("recomendarPlano — viradas por usuários", () => {
  it("1 usuário → Solo, sem mensagem de virada", () => {
    const r = rec(1, 0);
    expect(r.recomendado.plano.id).toBe("solo");
    expect(r.recomendado.total).toBe(119);
    expect(r.virada).toBeNull();
  });

  it("4 usuários ainda é Solo com adicionais", () => {
    const r = rec(4, 20);
    expect(r.recomendado.plano.id).toBe("solo");
    expect(r.recomendado.total).toBe(268.7);
    expect(r.virada).toBeNull();
  });

  it("5 usuários vira Escritório e avisa a economia sobre o Solo", () => {
    const r = rec(5, 20);
    expect(r.recomendado.plano.id).toBe("escritorio");
    expect(r.virada?.comparadoCom.id).toBe("solo");
    expect(r.virada?.diferenca).toBe(39.6);
  });

  it("10 usuários é Escritório; 11 vira Pro", () => {
    expect(rec(10, 50).recomendado.plano.id).toBe("escritorio");
    const r = rec(11, 50);
    expect(r.recomendado.plano.id).toBe("pro");
    expect(r.virada?.comparadoCom.id).toBe("escritorio");
    expect(r.virada?.diferenca).toBe(29.4);
  });

  it("23 usuários é Pro; 24 vira Ilimitado", () => {
    expect(rec(23, 100).recomendado.plano.id).toBe("pro");
    expect(rec(24, 100).recomendado.plano.id).toBe("ilimitado");
  });

  it("60 usuários: Ilimitado com 30 adicionais", () => {
    const r = rec(60, 0);
    expect(r.recomendado.plano.id).toBe("ilimitado");
    expect(r.recomendado.total).toBe(2487);
  });
});

describe("recomendarPlano — viradas por notas", () => {
  // 1 usuário: Solo = 109 + 0,50·n, sempre abaixo de Escritório e Pro; só o Ilimitado (990) alcança.
  it("1.761 notas ainda é Solo", () => {
    expect(rec(1, 1761).recomendado.plano.id).toBe("solo");
  });

  it("1.762 notas empata e fica com o plano maior, sem mensagem", () => {
    const r = rec(1, 1762);
    expect(r.recomendado.plano.id).toBe("ilimitado");
    expect(r.virada).toBeNull();
  });

  it("1.763 notas vira Ilimitado com mensagem", () => {
    const r = rec(1, 1763);
    expect(r.recomendado.plano.id).toBe("ilimitado");
    expect(r.virada?.comparadoCom.id).toBe("solo");
    expect(r.virada?.diferenca).toBe(0.5);
  });

  it("5 usuários e 600 notas: Escritório com excedente vence o Pro", () => {
    // Escritório 279 + 250 = 529 · Pro 549 · Solo 119 + 199,60 + 290 = 608,60
    const r = rec(5, 600);
    expect(r.recomendado.plano.id).toBe("escritorio");
    expect(r.recomendado.total).toBe(529);
  });

  it("2.000 notas: Ilimitado, comparado ao menor mais barato (Solo)", () => {
    const r = rec(1, 2000);
    expect(r.recomendado.plano.id).toBe("ilimitado");
    expect(r.virada?.comparadoCom.id).toBe("solo");
    expect(r.virada?.diferenca).toBe(119);
  });
});

describe("formatarBRL", () => {
  it("omite centavos em valores inteiros", () => {
    expect(formatarBRL(1190)).toBe("R$ 1.190");
    expect(formatarBRL(99.17)).toBe("R$ 99,17");
    expect(formatarBRL(49.9)).toBe("R$ 49,90");
  });
});

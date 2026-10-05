// =================================================================
// Tipos do cérebro da Bia (conhecimento/ → server/kb/*.generated.ts)
// =================================================================

export type FaseBia = 'cliente' | 'interna' | 'etapa3';

/** Um trecho recuperável do conhecimento (seção ### de um .md curado). */
export interface KbChunk {
  /** `{id do arquivo}#{slug da seção}` — é o id citado em "(fonte: kb:...)" */
  id: string;
  titulo: string;
  texto: string;
  tags: string[];
  fase: FaseBia;
  fonte: string;
  flags: string[];
  arquivo: string;
}

/** Uma linha da matriz de 71 produtos (matriz vigente v1.0 do Vision; texto descritivo herdado da v0.3). */
export interface MatrizProduto {
  id: string;
  ptype: string;
  product: string;
  mandate: string;
  cls: string;
  dur: string;
  yrs: [number, number];
  liq: string;
  tax: string;
  rate: string;
  floor: number;
  ev: string;
  iof: boolean;
  obj: string;
  role: string;
  risk: string;
  rl: number;
  dims: { m: number; c: number; l: number; x: number } | null;
  seg: string[];
  status: string;
  basis: string;
  note: string;
  /** o comentário da linha na v1.0: a correção da auditoria CFP × personas ou o A CONFIRMAR da linha nova */
  nota_v1?: string;
  /** marcas do motor da v1.0 (dm, matchableL, drag, income, wrapper, weak, review) */
  marcas_motor?: string[];
  /** de onde vem cada parte: o motor (v1.0) e o texto descritivo (v0.3, ou nenhum na linha nova) */
  origem?: { motor: string; descricao: string };
}

/** Uma estratégia candidata da Camada 3 da matriz v1.0. */
export interface MatrizEstrategia {
  id: string;
  texto: string;
}

export interface MatrizData {
  meta: {
    fonte: string;
    registro_fonte: string;
    aviso: string;
    fundamentos: string;
    tax_label: Record<string, string>;
    ptype_label: Record<string, string>;
  };
  produtos: MatrizProduto[];
  estrategias?: MatrizEstrategia[];
  /** os 20 objetivos da matriz v1.0, como vêm da fonte (sem tipagem fina: a lente só os lê) */
  objetivos?: Record<string, unknown>[];
}

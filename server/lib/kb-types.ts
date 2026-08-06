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

/** Uma linha da matriz de 66 produtos (extraída do JSX v0.3 do Vision). */
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
}

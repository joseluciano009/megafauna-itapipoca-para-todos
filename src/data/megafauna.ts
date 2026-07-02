import nothrotherium_maquinense from "@/assets/nothrotherium-maquinense.png";
import glyptodon_clavipes from "@/assets/glyptodon-clavipes.jpg";
import xenorhinotherium_bahiense from "@/assets/xenorhinotherium-bahiense.png";
import smilodon_populator from "@/assets/smilodon-populator.png";

export type Animal = {
  slug: string;
  nome: string;
  cientifico: string;
  imagem: string;
  resumo: string;
  descricao: string;
  curiosidades: string[];
  distribuicao: string;
  periodo: string;
  alimentacao: string;
  altura: string;
  peso: string;
};

export const megafauna: Animal[] = [
  {
    slug: "nothrotherium-maquinense",
    nome: "Nothrotherium maquinense",
    cientifico: "Nothrotherium maquinense",
    imagem: nothrotherium_maquinense,
    resumo:
      "O Nothrotherium maquinense foi uma preguiça-gigante terrestre de porte médio que viveu no Brasil durante o Pleistoceno. Alimentava-se de folhas, brotos e frutos.",
    descricao:
      "Possuía garras longas e fortes utilizadas para puxar galhos e cavar. Caminhava sobre as patas traseiras quando precisava alcançar vegetação mais alta. Era menor que outras preguiças-gigantes, mas ainda muito maior que as preguiças atuais.",
    curiosidades: [
      "Foi descrita a partir de fósseis encontrados na Gruta da Maquiné, em Minas Gerais.",
      "É uma das espécies fósseis mais conhecidas do Brasil.",
      "Conviveu com seres humanos no final do Pleistoceno.",
      "Sua extinção ocorreu há cerca de 11 mil anos.",
    ],
    distribuicao: "Brasil, especialmente Minas Gerais, Bahia, Ceará, Pernambuco e outras regiões do Nordeste e Sudeste.",
    periodo: "Pleistoceno (2,6 milhões a 11.700 anos atrás)",
    alimentacao: "Herbívoro, alimentava-se de folhas, frutos e brotos",
    altura: " Cerca de 1,2 a 1,5 m quando erguido.",
    peso: "200 a 300 kg",
  },

  {
    slug: "glyptodon-clavipes",
    nome: "Glyptodon",
    cientifico: "Glyptodon clavipes",
    imagem: glyptodon_clavipes,
    resumo:
      "O Glyptodon clavipes foi um grande mamífero herbívoro da megafauna sul-americana, aparentado aos tatus atuais. Era protegido por uma carapaça rígida formada por centenas de placas ósseas e viveu durante o Pleistoceno, desaparecendo há cerca de 11 mil anos.",
    descricao:
      "Possuía corpo robusto, patas curtas e fortes e uma grande carapaça arredondada que funcionava como proteção contra predadores. Sua cauda era espessa e revestida por anéis ósseos. Alimentava-se principalmente de gramíneas e outras plantas rasteiras. Seus fósseis são encontrados em diversas regiões da América do Sul, incluindo o Brasil.",
    curiosidades: [
      "Era parente dos tatus modernos, mas muito maior.",
      "Sua carapaça podia medir mais de 2 metros de comprimento.",
      "Conviveu com os primeiros seres humanos que chegaram à América do Sul.",
      "A extinção provavelmente ocorreu devido às mudanças climáticas e à caça humana.",
    ],
    distribuicao:"Argentina, Uruguai, Paraguai, Bolívia e diversas regiões do Brasil, especialmente Nordeste, Sudeste e Sul.",
    periodo:"Pleistoceno (aproximadamente 2,58 milhões a 11,7 mil anos atrás).",
    alimentacao:"Herbívoro.",
    altura:"Cerca de 1,5 m.",
    peso:"Entre 1 e 2 toneladas.",
  },

  {
    slug:"xenorhinotherium-bahiense",
    nome:"Macrauquenídeo brasileiro",
    cientifico:"Xenorhinotherium bahiense",
    imagem: xenorhinotherium_bahiense,
    resumo:
      "O Xenorhinotherium bahiense foi um mamífero herbívoro exclusivo da América do Sul, pertencente ao grupo dos macrauquenídeos. Possuía pescoço relativamente longo e uma pequena tromba flexível.",
    descricao:
      "Era semelhante a um camelo sem corcova, com pernas longas e focinho adaptado para sustentar uma pequena tromba. Alimentava-se de folhas, brotos e frutos. Viveu em ambientes de savanas e áreas abertas durante o Pleistoceno.",
                                      
    curiosidades:[
      "Seu nome significa 'animal de nariz estranho da Bahia'.",
      "Era um dos últimos representantes dos litopternos.",
      "A pequena tromba provavelmente auxiliava na alimentação.",
      "Seus fósseis são encontrados principalmente no Nordeste brasileiro.",
    ],
    distribuicao:
       "Principalmente Nordeste do Brasil, com registros na Bahia, Ceará, Pernambuco, Piauí e estados vizinhos.",
    periodo:
      "Pleistoceno.",
    alimentacao:
      "Herbívoro.",
    altura:
      "Cerca de 1,8 a 2 m.",
    peso:
      "Entre 180 e 300 kg.",
  },
  
  {
    slug: "smilodon-populator",
    nome: "Tigre-dentes-de-sabre",
    cientifico: "Smilodon populator",
    imagem: smilodon_populator,
    resumo:"O Smilodon populator foi o maior felino de dentes-de-sabre já conhecido. Era um poderoso predador que habitou a América do Sul durante o Pleistoceno.",
    descricao:"Possuía corpo musculoso, patas dianteiras extremamente fortes e caninos superiores que podiam atingir cerca de 28 cm de comprimento. Caçava grandes mamíferos, como preguiças-gigantes, cavalos e jovens mastodontes.",
       
    curiosidades: [
      "Foi o maior representante do gênero Smilodon.",
      "Seus dentes eram usados para desferir mordidas profundas após dominar a presa.",
      "Não era ancestral dos tigres atuais.",
      "Viveu na mesma época que diversos animais da megafauna brasileira.",
    ],
    distribuicao:
      "Brasil, Argentina, Uruguai, Paraguai, Bolívia e Venezuela.",
    periodo:
      "Pleistoceno.",
    alimentacao:
      "Carnívoro.",
    altura:
      "Cerca de 1,2 m até os ombros.",
    peso:
      "Entre 220 e 400 kg.",
  },
];

export const findAnimal = (slug: string) => megafauna.find((a) => a.slug === slug);
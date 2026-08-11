import type { components } from '../../api/schema'

type ContentOutputBody = components['schemas']['ContentOutputBody']

/**
 * Synthetic PT-BR editorial content for dev iteration and tests.
 * Mirrors what the couple will author in the admin — realistic in tone and
 * shape, but every word here is fixture data, never shipped to guests.
 * Serves: the dev mock (`src/test/dev-mock.ts`) and section render tests.
 */
export const fixtureContent: ContentOutputBody = {
  sections: [
    {
      slug: 'hero',
      enabled: true,
      hero: {
        title: 'Vamos nos casar',
        couple_names: 'Jade & João',
        event_datetime: '2027-08-07T15:00:00-03:00',
        city_label: 'Atibaia – SP',
        body: 'No jardim de casa, debaixo da nossa seriguela, com as pessoas que a gente mais ama.',
        images: [],
      },
    },
    {
      slug: 'our_story',
      enabled: true,
      our_story: {
        title: 'Nossa história',
        body: 'A gente se conheceu numa festa junina, entre uma quadrilha e um quentão — a Jade jura que foi o João quem puxou assunto, e o João jura de pé junto que foi ela.\n\nDe lá pra cá foram muitas viagens, três mudanças, um gato chamado *Farofa* e uma casa com quintal em Atibaia. Foi nesse quintal, debaixo da seriguela que o avô do João plantou, que veio o pedido — num domingo comum, de chinelo, do jeitinho que a gente gosta.\n\nAgora queremos celebrar esse capítulo com **vocês**, no lugar onde tudo aconteceu.',
        images: [],
      },
    },
    {
      slug: 'big_day',
      enabled: true,
      big_day: {
        title: 'O grande dia',
        body: 'A cerimônia e a festa acontecem no mesmo lugar: o jardim da nossa casa. Chegue com calma, pegue um refresco e escolha um lugar à sombra.',
        venue_notes:
          'A celebração é ao ar livre, na grama. Prefira salto bloco ou sapato baixo — salto fino afunda no gramado.',
        programme: [
          { time: '14:30', label: 'Chegada dos convidados' },
          { time: '15:00', label: 'Cerimônia no jardim' },
          { time: '16:00', label: 'Drinques e fotos' },
          { time: '17:30', label: 'Jantar servido' },
          { time: '19:00', label: 'Bolo e brinde' },
          { time: '20:00', label: 'Pista aberta' },
        ],
        images: [],
      },
    },
    {
      slug: 'rsvp',
      enabled: true,
      rsvp: {
        title: 'Confirme sua presença',
        body: 'Procure seu nome completo como está no convite e confirme por toda a sua família de uma vez só. Se o seu nome não aparecer, **fale com os noivos** pelo WhatsApp — a gente resolve rapidinho.',
        deadline: '2027-07-07',
        images: [],
      },
    },
    {
      slug: 'getting_there',
      enabled: true,
      getting_there: {
        title: 'Como chegar',
        address: 'Rua Piraju, 306 – Jardim Paulista, Atibaia – SP, 12947-321',
        body: 'Estamos a uns 10 minutos do centro de Atibaia e a mais ou menos 1h de São Paulo pela Fernão Dias. Vindo de fora, a saída 36 é a mais tranquila.',
        parking_notes:
          'Dá para estacionar na rua, dos dois lados — combinamos com os vizinhos. Se puder, venha de aplicativo: a volta fica mais leve depois do brinde.',
        map_embed_url: 'https://maps.google.com/?q=Rua+Piraju,+306,+Atibaia+-+SP',
        images: [],
      },
    },
    {
      slug: 'stay',
      enabled: true,
      stay: {
        title: 'Onde ficar',
        body: 'Para quem vem de longe, separamos cantinhos que a gente conhece e gosta. Reserve com antecedência — agosto é alta temporada na serra.',
        lodgings: [
          {
            name: 'Pousada Recanto da Seriguela',
            area: 'Centro',
            link: 'https://example.com/recanto-da-seriguela',
            notes: 'A 5 minutos de carro da nossa casa, café da manhã na varanda.',
            shuttle_served: true,
          },
          {
            name: 'Chalés do Alto da Serra',
            area: 'Alvinópolis',
            link: 'https://example.com/chales-alto-da-serra',
            notes: 'Vista para a Pedra Grande, lareira nos chalés.',
            shuttle_served: true,
          },
          {
            name: 'Hotel Jardim das Palmeiras',
            area: 'Jardim do Lago',
            link: 'https://example.com/jardim-das-palmeiras',
            notes: 'Opção maior, boa para famílias, com piscina aquecida.',
            shuttle_served: false,
          },
        ],
        airbnb_areas: ['Centro', 'Alvinópolis', 'Vila Giglio', 'Jardim do Lago'],
        images: [],
      },
    },
    {
      slug: 'gifts_intro',
      enabled: true,
      gifts_intro: {
        title: 'Presenteie os noivos',
        body: 'Sua presença é o que mais importa pra gente — de verdade. Mas se quiser nos mimar, montamos listas em algumas lojas e algumas metas dos sonhos, do nosso jeito.\n\n*Nada de caixa de som nem jogo de panela repetido, prometido.*',
        images: [],
      },
    },
    {
      slug: 'dress_code',
      enabled: true,
      dress_code: {
        title: 'O que vestir',
        attire: 'Esporte fino de jardim — leve, elegante e confortável.',
        body: 'Pense em tecidos frescos e cores vivas: a festa é à tarde, no meio das flores. Só pedimos que deixem o **branco** e o **off-white** para a noiva.\n\nAgosto em Atibaia esfria quando o sol se põe — traga um casaco para a noite.',
        images: [],
      },
    },
    {
      slug: 'good_practices',
      enabled: true,
      good_practices: {
        title: 'Boas práticas',
        body: 'Combinados de quem recebe em casa — pouquinhos, mas importantes.',
        rules: [
          'Cerimônia desplugada: durante o "sim", celulares guardados — nossos fotógrafos cuidam de tudo.',
          'Respeite o horário: a cerimônia começa pontualmente às 15h.',
          'A festa é ao ar livre — traga repelente e um agasalho para a noite.',
          'Crianças são bem-vindas e amadas; apenas fiquem de olho perto do lago.',
          'Beba com alegria e volte com segurança: vá de aplicativo ou combine carona.',
        ],
        images: [],
      },
    },
    {
      slug: 'messages_intro',
      enabled: true,
      messages_intro: {
        title: 'Recado aos noivos',
        body: 'Deixe aqui um recado, um conselho ou aquela história que só você sabe — vamos ler tudo juntinhos na lua de mel.',
        images: [],
      },
    },
  ],
}

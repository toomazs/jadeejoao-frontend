import type { components } from '../../api/schema'

type ContentOutputBody = components['schemas']['ContentOutputBody']

/**
 * Fixture content for tests and the dev-gated mock transport.
 * It MIRRORS the API's real seed migrations (00002 + 00007–00009) — never invented
 * facts: what the mock shows is exactly what a fresh database serves. When a
 * seed changes, update this mirror.
 */
export const fixtureContent: ContentOutputBody = {
  sections: [
    {
      slug: 'hero',
      enabled: true,
      hero: {
        title: 'Jade & João',
        body: 'Estamos muito felizes em compartilhar mais este momento de nossas vidas com vocês!',
        images: [],
        couple_names: 'Jade & João',
        event_datetime: '2027-08-07T15:00:00-03:00',
        city_label: 'Atibaia – SP',
        hero_image_url:
          'https://ykvsimxpchaqbsqsqsfs.supabase.co/storage/v1/object/public/jadeejoao-bucket/hero/jade-e-joao.jpg',
        milestones: [
          { label: 'Nossa família' },
          { label: 'Nossa casa em Atibaia' },
          { label: 'O grande dia', date: '2027-08-07' },
        ],
      },
    },
    {
      slug: 'our_story',
      enabled: true,
      our_story: {
        title: 'Vamos te mostrar um pouco da nossa história!',
        body: 'Estamos muito felizes de te convidar para o nosso casamento!',
        images: [],
        moments: [
          {
            label: 'Jade e Francisca',
            date: '12 de maio de 2020',
            image_url: 'https://ykvsimxpchaqbsqsqsfs.supabase.co/storage/v1/object/public/jadeejoao-bucket/story/01-jade-e-francisca.jpg',
          },
          {
            label: 'Jade e João',
            date: '12 de junho de 2020',
            image_url: 'https://ykvsimxpchaqbsqsqsfs.supabase.co/storage/v1/object/public/jadeejoao-bucket/story/02-jade-e-joao.jpg',
          },
        ],
        letter_from_groom: 'É muito fácil ser feliz com a Jade.',
        letter_from_bride: 'Eu tirei cartas no tarô e João tava lá.',
        bride: {
          name: 'Jade',
          photo_url:
            'https://ykvsimxpchaqbsqsqsfs.supabase.co/storage/v1/object/public/jadeejoao-bucket/couple/jade.jpg',
          instagram: 'xadenascimento',
        },
        groom: {
          name: 'João',
          photo_url:
            'https://ykvsimxpchaqbsqsqsfs.supabase.co/storage/v1/object/public/jadeejoao-bucket/couple/joao.jpg',
          instagram: 'joaodiaspedro',
        },
      },
    },
    {
      slug: 'big_day',
      enabled: true,
      big_day: {
        title: 'O Grande Dia',
        body: 'A cerimônia e a festa acontecem na casa dos noivos, em Atibaia. O espaço é ao ar livre, com grama — escolha um calçado confortável!',
        images: [],
        venue_notes: 'Espaço externo com grama. Evite salto fino e prefira calçados confortáveis.',
        programme: [
          { time: '15:00', label: 'Recepção dos convidados' },
          { time: '16:00', label: 'Entrada do noivo' },
          { time: '16:10', label: 'Padrinhos e madrinhas' },
          { time: '16:20', label: 'Entrada de Linda e Marcos' },
          { time: '16:30', label: 'Floristas e entrada da noiva' },
          { time: '16:35', label: 'Início da cerimônia' },
          { time: '16:50', label: 'Texto da Kyhsa' },
          { time: '17:00', label: 'Votos dos noivos' },
          { time: '17:05', label: 'Troca de alianças' },
          { time: '17:10', label: 'Dama de honra' },
          { time: '17:30', label: 'Encerramento e começo da festa' },
        ],
      },
    },
    {
      slug: 'rsvp',
      enabled: true,
      rsvp: {
        title: 'Confirmação de Presença',
        body: 'Digite seu nome completo para encontrar seu convite e confirmar a presença de cada pessoa do seu grupo. Se não encontrar seu nome, fale com os noivos.',
        images: [],
        deadline: '2027-07-07',
      },
    },
    {
      slug: 'getting_there',
      enabled: true,
      getting_there: {
        title: 'Como Chegar',
        body: 'A festa será na casa dos noivos, no Jardim Paulista, em Atibaia – SP.',
        images: [],
        address: 'Rua Piraju, 306 – Jardim Paulista, Atibaia – SP, 12947-321',
        map_embed_url:
          'https://www.google.com/maps?q=Rua+Piraju,+306,+Jardim+Paulista,+Atibaia+-+SP&output=embed',
        parking_notes:
          'Não há estacionamento próximo ao local. Sugerimos dormir na cidade e usar Uber ou o translado que vamos oferecer.',
      },
    },
    {
      slug: 'stay',
      enabled: true,
      stay: {
        title: 'Onde Ficar',
        body: 'Separamos sugestões de hotéis e pousadas em Atibaia. Haverá van/translado entre as hospedagens sugeridas e o local da festa.',
        images: [],
        lodgings: [],
        airbnb_areas: ['Jardim Paulista', 'Centro'],
      },
    },
    {
      slug: 'gifts_intro',
      enabled: true,
      gifts_intro: {
        title: 'Lista de Presentes',
        body: 'O maior presente é ter você com a gente! Mas, se quiser nos mimar, preparamos uma lista com metas e cotas — cada contribuição vira um pedacinho do nosso novo capítulo. O pagamento é por PIX, direto para os noivos.',
        images: [],
      },
    },
    {
      slug: 'dress_code',
      enabled: true,
      dress_code: {
        title: 'Dress Code',
        body: 'Traje esporte fino: elegância com conforto. Lembre que a festa é ao ar livre, em grama — escolha calçados que combinem com o gramado. Vista-se bonito e sinta-se à vontade para dançar!',
        images: [],
        attire: 'Sofisticado, confortável, vestido longo, esporte fino.',
      },
    },
    {
      slug: 'good_practices',
      enabled: true,
      good_practices: {
        title: 'Para Aproveitar Nosso Dia',
        body: 'Algumas combinações carinhosas para o nosso dia sair perfeito:',
        images: [],
        rules: [
          'Deixe as opiniões polêmicas em casa — dia de casamento não é dia de discutir',
          'O open bar é generoso, mas não vire decoração no chão',
          'Se beber, não dirija: haverá translado para os hotéis sugeridos',
          'Aproveite muito, dance e celebre com a gente!',
        ],
      },
    },
    {
      slug: 'messages_intro',
      enabled: true,
      messages_intro: {
        title: 'Recado aos Noivos',
        body: 'Deixe aqui seu carinho, um conselho ou aquela história que só você sabe. Os noivos vão ler cada recado com o coração quentinho.',
        images: [],
      },
    },
  ],
}

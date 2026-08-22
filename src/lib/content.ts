import type { components } from '../api/schema'

type Section = components['schemas']['Section']
type ContentOutputBody = components['schemas']['ContentOutputBody']

/** The closed slug set, always rendered in this fixed order (AD-7). */
export const SECTION_ORDER = [
  'hero',
  'our_story',
  'big_day',
  'rsvp',
  'getting_there',
  'stay',
  'gifts_intro',
  'dress_code',
  'good_practices',
  'messages_intro',
] as const satisfies readonly NonNullable<Section['slug']>[]

export type SectionSlug = (typeof SECTION_ORDER)[number]

/** Marks the given keys required and strips `null`, so array fields are always arrays. */
type WithArrays<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }

export type HeroContent = WithArrays<components['schemas']['HeroPayload'], 'images' | 'milestones'>
export type OurStoryContent = WithArrays<components['schemas']['OurStoryPayload'], 'images'>
export type BigDayContent = WithArrays<components['schemas']['BigDayPayload'], 'images' | 'programme'>
export type RsvpContent = WithArrays<components['schemas']['RSVPPayload'], 'images'>
export type GettingThereContent = WithArrays<components['schemas']['GettingTherePayload'], 'images'>
export type StayContent = WithArrays<
  components['schemas']['StayPayload'],
  'images' | 'lodgings' | 'airbnb_areas'
>
export type GiftsIntroContent = WithArrays<components['schemas']['GiftsIntroPayload'], 'images'>
export type DressCodeContent = WithArrays<components['schemas']['DressCodePayload'], 'images'>
export type GoodPracticesContent = WithArrays<
  components['schemas']['GoodPracticesPayload'],
  'images' | 'rules'
>
export type MessagesIntroContent = WithArrays<components['schemas']['MessagesIntroPayload'], 'images'>

/** One entry per enabled section, discriminated by slug, in fixed render order. */
export type NormalizedSection =
  | { slug: 'hero'; payload: HeroContent }
  | { slug: 'our_story'; payload: OurStoryContent }
  | { slug: 'big_day'; payload: BigDayContent }
  | { slug: 'rsvp'; payload: RsvpContent }
  | { slug: 'getting_there'; payload: GettingThereContent }
  | { slug: 'stay'; payload: StayContent }
  | { slug: 'gifts_intro'; payload: GiftsIntroContent }
  | { slug: 'dress_code'; payload: DressCodeContent }
  | { slug: 'good_practices'; payload: GoodPracticesContent }
  | { slug: 'messages_intro'; payload: MessagesIntroContent }

const arr = <T,>(value: readonly T[] | null | undefined): T[] => (value ? [...value] : [])

/**
 * Normalizes `GET /api/v1/content` into a typed, ordered view:
 * - fixed section order regardless of response order;
 * - a section is matched by its payload key (the `slug` field is optional in types);
 * - disabled or missing sections are simply absent;
 * - nullable arrays become empty arrays.
 */
export function normalizeContent(body: ContentOutputBody): NormalizedSection[] {
  const enabled = (body.sections ?? []).filter((section) => section.enabled)

  const bySlug = <S extends SectionSlug>(slug: S): Section[S] | undefined =>
    enabled.find((section) => section[slug] != null)?.[slug]

  const view: NormalizedSection[] = []

  const hero = bySlug('hero')
  if (hero) {
    view.push({
      slug: 'hero',
      payload: { ...hero, images: arr(hero.images), milestones: arr(hero.milestones) },
    })
  }

  const ourStory = bySlug('our_story')
  if (ourStory) {
    view.push({ slug: 'our_story', payload: { ...ourStory, images: arr(ourStory.images) } })
  }

  const bigDay = bySlug('big_day')
  if (bigDay) {
    view.push({
      slug: 'big_day',
      payload: { ...bigDay, images: arr(bigDay.images), programme: arr(bigDay.programme) },
    })
  }

  const rsvp = bySlug('rsvp')
  if (rsvp) {
    view.push({ slug: 'rsvp', payload: { ...rsvp, images: arr(rsvp.images) } })
  }

  const gettingThere = bySlug('getting_there')
  if (gettingThere) {
    view.push({
      slug: 'getting_there',
      payload: { ...gettingThere, images: arr(gettingThere.images) },
    })
  }

  const stay = bySlug('stay')
  if (stay) {
    view.push({
      slug: 'stay',
      payload: {
        ...stay,
        images: arr(stay.images),
        lodgings: arr(stay.lodgings),
        airbnb_areas: arr(stay.airbnb_areas),
      },
    })
  }

  const giftsIntro = bySlug('gifts_intro')
  if (giftsIntro) {
    view.push({ slug: 'gifts_intro', payload: { ...giftsIntro, images: arr(giftsIntro.images) } })
  }

  const dressCode = bySlug('dress_code')
  if (dressCode) {
    view.push({ slug: 'dress_code', payload: { ...dressCode, images: arr(dressCode.images) } })
  }

  const goodPractices = bySlug('good_practices')
  if (goodPractices) {
    view.push({
      slug: 'good_practices',
      payload: {
        ...goodPractices,
        images: arr(goodPractices.images),
        rules: arr(goodPractices.rules),
      },
    })
  }

  const messagesIntro = bySlug('messages_intro')
  if (messagesIntro) {
    view.push({
      slug: 'messages_intro',
      payload: { ...messagesIntro, images: arr(messagesIntro.images) },
    })
  }

  return view
}

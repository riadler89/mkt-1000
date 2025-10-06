import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionComponentSkeleton } from "./TypeAccordionComponent";
import type { TypeButtonComponentSkeleton } from "./TypeButtonComponent";
import type { TypeDividerComponentSkeleton } from "./TypeDividerComponent";
import type { TypeGridComponentSkeleton } from "./TypeGridComponent";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeLinkComponentSkeleton } from "./TypeLinkComponent";
import type { TypeRichTextComponentSkeleton } from "./TypeRichTextComponent";
import type { TypeSectionComponentSkeleton } from "./TypeSectionComponent";
import type { TypeSliderComponentSkeleton } from "./TypeSliderComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";
import type { TypeVideoComponentSkeleton } from "./TypeVideoComponent";

export interface TypePageComponentFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    metaTitle?: EntryFieldTypes.Symbol;
    metaDescription?: EntryFieldTypes.Symbol;
    robots?: EntryFieldTypes.Symbol<"index, follow" | "index, nofollow" | "noindex, follow" | "noindex, nofollow">;
    content?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionComponentSkeleton | TypeButtonComponentSkeleton | TypeDividerComponentSkeleton | TypeGridComponentSkeleton | TypeImageComponentSkeleton | TypeLinkComponentSkeleton | TypeRichTextComponentSkeleton | TypeSectionComponentSkeleton | TypeSliderComponentSkeleton | TypeTextComponentSkeleton | TypeVideoComponentSkeleton>>;
}

export type TypePageComponentSkeleton = EntrySkeletonType<TypePageComponentFields, "PageComponent">;
export type TypePageComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePageComponentSkeleton, Modifiers, Locales>;

export function isTypePageComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypePageComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'PageComponent'
}

export type TypePageComponentWithoutLinkResolutionResponse = TypePageComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypePageComponentWithoutUnresolvableLinksResponse = TypePageComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypePageComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypePageComponent<"WITH_ALL_LOCALES", Locales>;
export type TypePageComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypePageComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypePageComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypePageComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAccordionItemComponentSkeleton } from "./TypeAccordionItemComponent";

export interface TypeAccordionComponentFields {
    title?: EntryFieldTypes.Symbol;
    content: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAccordionItemComponentSkeleton>>;
}

export type TypeAccordionComponentSkeleton = EntrySkeletonType<TypeAccordionComponentFields, "AccordionComponent">;
export type TypeAccordionComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAccordionComponentSkeleton, Modifiers, Locales>;

export function isTypeAccordionComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeAccordionComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'AccordionComponent'
}

export type TypeAccordionComponentWithoutLinkResolutionResponse = TypeAccordionComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeAccordionComponentWithoutUnresolvableLinksResponse = TypeAccordionComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeAccordionComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeAccordionComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeAccordionComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeAccordionComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

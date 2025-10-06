import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeTextComponentFields {
    content?: EntryFieldTypes.Text;
    textType?: EntryFieldTypes.Symbol<"h1" | "h2" | "h3" | "h4" | "p">;
}

export type TypeTextComponentSkeleton = EntrySkeletonType<TypeTextComponentFields, "TextComponent">;
export type TypeTextComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTextComponentSkeleton, Modifiers, Locales>;

export function isTypeTextComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeTextComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'TextComponent'
}

export type TypeTextComponentWithoutLinkResolutionResponse = TypeTextComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeTextComponentWithoutUnresolvableLinksResponse = TypeTextComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeTextComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeTextComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeTextComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeTextComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeTextComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeTextComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeButtonComponentFields {
    text?: EntryFieldTypes.Symbol;
    style?: EntryFieldTypes.Symbol<"accent" | "outline" | "primary" | "secondary">;
    url: EntryFieldTypes.Symbol;
    openInNewTab?: EntryFieldTypes.Boolean;
}

export type TypeButtonComponentSkeleton = EntrySkeletonType<TypeButtonComponentFields, "ButtonComponent">;
export type TypeButtonComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeButtonComponentSkeleton, Modifiers, Locales>;

export function isTypeButtonComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeButtonComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'ButtonComponent'
}

export type TypeButtonComponentWithoutLinkResolutionResponse = TypeButtonComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeButtonComponentWithoutUnresolvableLinksResponse = TypeButtonComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeButtonComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeButtonComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeButtonComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeButtonComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeButtonComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeButtonComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

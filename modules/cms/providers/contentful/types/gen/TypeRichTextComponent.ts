import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeRichTextComponentFields {
    name: EntryFieldTypes.Symbol;
    content: EntryFieldTypes.RichText;
}

export type TypeRichTextComponentSkeleton = EntrySkeletonType<TypeRichTextComponentFields, "RichTextComponent">;
export type TypeRichTextComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRichTextComponentSkeleton, Modifiers, Locales>;

export function isTypeRichTextComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeRichTextComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'RichTextComponent'
}

export type TypeRichTextComponentWithoutLinkResolutionResponse = TypeRichTextComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeRichTextComponentWithoutUnresolvableLinksResponse = TypeRichTextComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeRichTextComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeRichTextComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeRichTextComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeRichTextComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeRichTextComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeRichTextComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

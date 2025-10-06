import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeDividerComponentFields {
    name: EntryFieldTypes.Symbol;
    height: EntryFieldTypes.Symbol<"large" | "medium" | "small">;
    showLine?: EntryFieldTypes.Boolean;
}

export type TypeDividerComponentSkeleton = EntrySkeletonType<TypeDividerComponentFields, "DividerComponent">;
export type TypeDividerComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeDividerComponentSkeleton, Modifiers, Locales>;

export function isTypeDividerComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeDividerComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'DividerComponent'
}

export type TypeDividerComponentWithoutLinkResolutionResponse = TypeDividerComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeDividerComponentWithoutUnresolvableLinksResponse = TypeDividerComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeDividerComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeDividerComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeDividerComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeDividerComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeDividerComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeDividerComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

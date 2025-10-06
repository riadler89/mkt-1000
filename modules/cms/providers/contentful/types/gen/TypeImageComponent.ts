import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeImageComponentFields {
    imageDesktop: EntryFieldTypes.AssetLink;
    aspectRatioDesktop?: EntryFieldTypes.Symbol<"16:9" | "1:1" | "4:3" | "original">;
    imageMobile?: EntryFieldTypes.AssetLink;
    aspectRatioMobile?: EntryFieldTypes.Symbol<"16:9" | "1:1" | "4:3" | "original">;
    altText: EntryFieldTypes.Symbol;
}

export type TypeImageComponentSkeleton = EntrySkeletonType<TypeImageComponentFields, "ImageComponent">;
export type TypeImageComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeImageComponentSkeleton, Modifiers, Locales>;

export function isTypeImageComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeImageComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'ImageComponent'
}

export type TypeImageComponentWithoutLinkResolutionResponse = TypeImageComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeImageComponentWithoutUnresolvableLinksResponse = TypeImageComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeImageComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeImageComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeImageComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeImageComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeImageComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeImageComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

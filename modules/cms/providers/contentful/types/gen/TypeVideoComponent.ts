import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeVideoComponentFields {
    name: EntryFieldTypes.Symbol;
    video: EntryFieldTypes.AssetLink;
    previewImageDesktop: EntryFieldTypes.AssetLink;
    previewImageMobile?: EntryFieldTypes.AssetLink;
    aspectRatio?: EntryFieldTypes.Symbol<"16:9" | "1:1" | "4:3">;
    autoplay?: EntryFieldTypes.Boolean;
    muted?: EntryFieldTypes.Boolean;
    loop?: EntryFieldTypes.Boolean;
    showControls?: EntryFieldTypes.Boolean;
}

export type TypeVideoComponentSkeleton = EntrySkeletonType<TypeVideoComponentFields, "VideoComponent">;
export type TypeVideoComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeVideoComponentSkeleton, Modifiers, Locales>;

export function isTypeVideoComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeVideoComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'VideoComponent'
}

export type TypeVideoComponentWithoutLinkResolutionResponse = TypeVideoComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeVideoComponentWithoutUnresolvableLinksResponse = TypeVideoComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeVideoComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeVideoComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeVideoComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeVideoComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeVideoComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeVideoComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

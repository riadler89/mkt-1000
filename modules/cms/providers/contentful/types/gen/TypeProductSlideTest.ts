import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeProductSlideTestFields {
    products?: EntryFieldTypes.Object;
    categories?: EntryFieldTypes.Object;
}

export type TypeProductSlideTestSkeleton = EntrySkeletonType<TypeProductSlideTestFields, "productSlideTest">;
export type TypeProductSlideTest<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeProductSlideTestSkeleton, Modifiers, Locales>;

export function isTypeProductSlideTest<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeProductSlideTest<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'productSlideTest'
}

export type TypeProductSlideTestWithoutLinkResolutionResponse = TypeProductSlideTest<"WITHOUT_LINK_RESOLUTION">;
export type TypeProductSlideTestWithoutUnresolvableLinksResponse = TypeProductSlideTest<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeProductSlideTestWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeProductSlideTest<"WITH_ALL_LOCALES", Locales>;
export type TypeProductSlideTestWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeProductSlideTest<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeProductSlideTestWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeProductSlideTest<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

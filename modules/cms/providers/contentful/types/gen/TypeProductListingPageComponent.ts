import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeSectionComponentSkeleton } from "./TypeSectionComponent";
import type { TypeSliderComponentSkeleton } from "./TypeSliderComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";

export interface TypeProductListingPageComponentFields {
    slug: EntryFieldTypes.Symbol;
    teaserContent?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeImageComponentSkeleton | TypeSectionComponentSkeleton | TypeSliderComponentSkeleton | TypeTextComponentSkeleton>>;
}

export type TypeProductListingPageComponentSkeleton = EntrySkeletonType<TypeProductListingPageComponentFields, "productListingPageComponent">;
export type TypeProductListingPageComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeProductListingPageComponentSkeleton, Modifiers, Locales>;

export function isTypeProductListingPageComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeProductListingPageComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'productListingPageComponent'
}

export type TypeProductListingPageComponentWithoutLinkResolutionResponse = TypeProductListingPageComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeProductListingPageComponentWithoutUnresolvableLinksResponse = TypeProductListingPageComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeProductListingPageComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeProductListingPageComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeProductListingPageComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeProductListingPageComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeProductListingPageComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeProductListingPageComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

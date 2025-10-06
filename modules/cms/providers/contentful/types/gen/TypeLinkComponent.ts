import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeImageComponentSkeleton } from "./TypeImageComponent";
import type { TypeTextComponentSkeleton } from "./TypeTextComponent";

export interface TypeLinkComponentFields {
    name: EntryFieldTypes.Symbol;
    url: EntryFieldTypes.Symbol;
    openInNewTab?: EntryFieldTypes.Boolean;
    content?: EntryFieldTypes.EntryLink<TypeImageComponentSkeleton | TypeTextComponentSkeleton>;
}

export type TypeLinkComponentSkeleton = EntrySkeletonType<TypeLinkComponentFields, "LinkComponent">;
export type TypeLinkComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLinkComponentSkeleton, Modifiers, Locales>;

export function isTypeLinkComponent<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeLinkComponent<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'LinkComponent'
}

export type TypeLinkComponentWithoutLinkResolutionResponse = TypeLinkComponent<"WITHOUT_LINK_RESOLUTION">;
export type TypeLinkComponentWithoutUnresolvableLinksResponse = TypeLinkComponent<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeLinkComponentWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeLinkComponent<"WITH_ALL_LOCALES", Locales>;
export type TypeLinkComponentWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeLinkComponent<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeLinkComponentWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeLinkComponent<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
